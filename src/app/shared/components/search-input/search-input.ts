import { Component, EventEmitter, Output, effect, input, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchEvent } from '@shared/models/search-event.model';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, NgIf],
  template: `
    <mat-form-field class="search-input" appearance="outline" subscriptSizing="dynamic">
      <mat-label>{{ label() }}</mat-label>
      <mat-icon matPrefix>search</mat-icon>
      <input matInput type="search" [placeholder]="placeholder()" [formControl]="searchControl" />
      <button
        *ngIf="searchControl.value"
        mat-icon-button
        matSuffix
        type="button"
        aria-label="Clear search"
        (click)="clear()"
      >
        <mat-icon>close</mat-icon>
      </button>
    </mat-form-field>
  `,
  styles: `
    :host {
      display: block;
    }

    .search-input {
      width: 100%;
    }
  `,
})
export class SearchInput {
  @Output() searchChange = new EventEmitter<SearchEvent>();

  readonly label = input('Search');
  readonly placeholder = input('Type to search');
  readonly initialValue = input<string>('');
  readonly searchControl = new FormControl('', { nonNullable: true });

  constructor() {
    effect(() => {
      const value = this.initialValue() ?? '';
      this.searchControl.setValue(value, { emitEvent: false });
    });

    this.searchControl.valueChanges
      .pipe(startWith(this.searchControl.value), debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((query) => this.emitSearch(query));
  }

  private emitSearch(query: string): void {
    this.searchChange.emit({ query: query.trim() });
  }

  protected clear(): void {
    if (!this.searchControl.value) {
      return;
    }
    this.searchControl.setValue('', { emitEvent: true });
  }
}
