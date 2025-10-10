import { NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, effect, forwardRef, inject, input, output, signal } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PageRequest } from '@shared/models/page-request.model';
import { PagedResponse } from '@shared/models/paged-response.model';

type LoaderFn<T> = (request: PageRequest) => Observable<PagedResponse<T>>;

@Component({
  selector: 'app-entity-lookup',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './entity-lookup.html',
  styleUrl: './entity-lookup.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EntityLookupComponent),
      multi: true,
    },
  ],
})
export class EntityLookupComponent<T> implements ControlValueAccessor {
  private readonly destroyRef = inject(DestroyRef);

  readonly label = input<string>('Select option');
  readonly placeholder = input<string>('Search');
  readonly hint = input<string | null>(null);
  readonly rows = input<number>(20);
  readonly loader = input<LoaderFn<T>>(() =>
    of({
      items: [],
      metadata: {
        page: 1,
        rows: 0,
        offset: 0,
        query: null,
        totalRows: 0,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false,
      },
    })
  );
  readonly displayWith = input<(option: T | null) => string>((option) =>
    option ? String((option as Record<string, unknown>)?.['name'] ?? (option as Record<string, unknown>)?.['id'] ?? option) : ''
  );
  readonly valueSelector = input<(option: T) => unknown>((option) => (option as Record<string, unknown>)?.['id'] ?? option);
  readonly selectionChange = output<T | null>();

  protected readonly searchControl = new FormControl('', { nonNullable: true });
  protected readonly options = signal<T[]>([]);
  protected readonly loading = signal(false);
  protected readonly isDisabled = signal(false);
  protected readonly selected = signal<unknown>(null);

  private onChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          this.loading.set(true);
          return this.loader()({ query, page: 1, rows: this.rows(), offset: 0 });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (response) => {
          this.options.set(response.items);
          this.loading.set(false);
        },
        error: () => {
          this.options.set([]);
          this.loading.set(false);
        },
      });

    effect(
      () => {
        this.loader();
        this.fetch(this.searchControl.value);
      },
      { allowSignalWrites: true }
    );
  }

  writeValue(value: unknown): void {
    this.selected.set(value);
    if (!value) {
      this.searchControl.setValue('', { emitEvent: false });
    }
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
    if (isDisabled) {
      this.searchControl.disable({ emitEvent: false });
    } else {
      this.searchControl.enable({ emitEvent: false });
    }
  }

  protected displayFn = (option: T | null) => this.displayWith()(option);

  protected onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const option = event.option.value as T;
    this.searchControl.setValue(this.displayFn(option), { emitEvent: false });
    this.selected.set(this.valueSelector()(option));
    this.onChange(this.selected());
    this.selectionChange.emit(option);
    this.onTouched();
  }

  protected handleBlur(): void {
    this.onTouched();
  }

  protected clearSelection(): void {
    this.selected.set(null);
    this.searchControl.setValue('', { emitEvent: true });
    this.onChange(null);
    this.selectionChange.emit(null);
  }

  private fetch(query: string): void {
    this.loading.set(true);
    this.loader()({ query, page: 1, rows: this.rows(), offset: 0 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.options.set(response.items);
          this.loading.set(false);
        },
        error: () => {
          this.options.set([]);
          this.loading.set(false);
        },
      });
  }
}
