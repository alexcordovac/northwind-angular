import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { SearchInput } from './search-input';
import { SearchEvent } from '@shared/models/search-event.model';

describe('SearchInput', () => {
  let component: SearchInput;
  let fixture: ComponentFixture<SearchInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchInput],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchInput);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should emit trimmed search values after debounce', fakeAsync(() => {
    const emissions: SearchEvent[] = [];
    component.searchChange.subscribe((event) => emissions.push(event));

    fixture.detectChanges();

    component.searchControl.setValue('  chai  ');
    tick(300);

    expect(emissions.pop()?.query).toBe('chai');
  }));

  it('should apply provided label, placeholder, and initial value', () => {
    component.label.set('Find item');
    component.placeholder.set('Type here');
    component.initialValue.set('Initial');

    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('mat-label')?.textContent).toBe('Find item');
    const input = element.querySelector('input') as HTMLInputElement;
    expect(input.placeholder).toBe('Type here');
    expect(component.searchControl.value).toBe('Initial');
  });

  it('should clear the input and emit an empty query when the clear button is pressed', fakeAsync(() => {
    const emissions: string[] = [];
    component.searchChange.subscribe((event) => emissions.push(event.query));

    fixture.detectChanges();

    component.searchControl.setValue('Orders');
    tick(300);
    fixture.detectChanges();

    const clearButton = fixture.nativeElement.querySelector('button[mat-icon-button]');
    expect(clearButton).not.toBeNull();

    clearButton?.dispatchEvent(new Event('click'));
    tick(300);

    expect(component.searchControl.value).toBe('');
    expect(emissions.includes('')).toBeTrue();
  }));
});
