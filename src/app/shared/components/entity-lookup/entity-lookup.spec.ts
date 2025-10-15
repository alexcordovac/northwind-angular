import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { of, throwError } from 'rxjs';

import { EntityLookupComponent } from './entity-lookup';
import { PageRequest } from '@shared/models/page-request.model';
import { PagedResponse } from '@shared/models/paged-response.model';

interface TestOption {
  id: number;
  name: string;
}

describe('EntityLookupComponent', () => {
  let component: EntityLookupComponent<TestOption>;
  let fixture: ComponentFixture<EntityLookupComponent<TestOption>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityLookupComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
    fixture = TestBed.createComponent(EntityLookupComponent<TestOption>);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load options through the configured loader on init', fakeAsync(() => {
    const expected: PagedResponse<TestOption> = {
      items: [{ id: 1, name: 'Chai' }],
      metadata: {
        page: 1,
        rows: 20,
        offset: 0,
        query: '',
        totalRows: 1,
        totalPages: 1,
        hasPrevious: false,
        hasNext: false,
      },
    };

    const loaderSpy = jasmine.createSpy('loaderSpy').and.callFake((request: PageRequest) => {
      expect(request).toEqual({ page: 1, rows: 20, offset: 0, query: '' });
      return of(expected);
    });

    component['loader'].set(loaderSpy);
    fixture.detectChanges();

    tick();

    expect(loaderSpy).toHaveBeenCalledTimes(1);
    expect(component['options']()).toEqual(expected.items);
    expect(component['loading']()).toBeFalse();
    expect(component['error']()).toBeNull();
  }));

  it('should trigger new searches when the control value changes', fakeAsync(() => {
    const loaderSpy = jasmine.createSpy('loaderSpy').and.callFake((request: PageRequest) =>
      of({
        items: [],
        metadata: {
          page: 1,
          rows: 20,
          offset: 0,
          query: request.query ?? '',
          totalRows: 0,
          totalPages: 0,
          hasPrevious: false,
          hasNext: false,
        },
      }),
    );

    component['loader'].set(loaderSpy);
    fixture.detectChanges();
    tick();

    component['searchControl'].setValue('Chai');
    tick(500);
    expect(loaderSpy).toHaveBeenCalledWith(jasmine.objectContaining({ query: 'Chai' }));
  }));

  it('should emit selection changes and update internal state', fakeAsync(() => {
    const option: TestOption = { id: 7, name: 'Ikura' };
    component['loader'].set((request) => {
      return of({
        items: [option],
        metadata: {
          page: 1,
          rows: 20,
          offset: 0,
          query: request.query,
          totalRows: 1,
          totalPages: 1,
          hasPrevious: false,
          hasNext: false,
        },
      });
    });

    const selectionSpy = jasmine.createSpy('selectionSpy');
    component.selectionChange.subscribe(selectionSpy);

    fixture.detectChanges();
    tick();

    const event = { option: { value: option } } as MatAutocompleteSelectedEvent;
    component['onOptionSelected'](event);

    expect(component['selected']()).toEqual(option.id);
    expect(selectionSpy).toHaveBeenCalledWith(option);
    expect(component['searchControl'].value).toBe(option.name);
  }));

  it('should clear the current selection', fakeAsync(() => {
    component['selected'].set(99);
    component['searchControl'].setValue('Existing');
    component['loader'].set(() =>
      of({
        items: [],
        metadata: {
          page: 1,
          rows: 20,
          offset: 0,
          query: '',
          totalRows: 0,
          totalPages: 0,
          hasPrevious: false,
          hasNext: false,
        },
      }),
    );

    const selectionSpy = jasmine.createSpy('selectionSpy');
    component.selectionChange.subscribe(selectionSpy);

    fixture.detectChanges();
    tick();

    component['clearSelection']();

    expect(component['selected']()).toBeNull();
    expect(component['searchControl'].value).toBe('');
    expect(selectionSpy).toHaveBeenCalledWith(null);
  }));

  it('should surface loader errors with the configured message', fakeAsync(() => {
    component['loader'].set(() =>
      throwError(() => new Error('Network error')),
    );

    fixture.detectChanges();
    tick();

    expect(component['options']()).toEqual([]);
    expect(component['error']()).toBe('Unable to load options. Try again.');
    expect(component['loading']()).toBeFalse();
  }));
});
