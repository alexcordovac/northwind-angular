import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';

import { LoadingState } from './loading-state';

describe('LoadingState', () => {
  let component: LoadingState;
  let fixture: ComponentFixture<LoadingState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingState],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingState);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display a spinner and loading message when loading', () => {
    component.loading.set(true);
    component.loadingLabel.set('Loading records…');

    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('mat-progress-spinner')).not.toBeNull();
    expect(element.textContent).toContain('Loading records…');
  });

  it('should render an error state with retry action', () => {
    const retrySpy = jasmine.createSpy('retry');
    component.loading.set(false);
    component.error.set('Failed to load');
    component.retry.set(retrySpy);

    fixture.detectChanges();

    const message = fixture.debugElement.query(By.css('.loading-state__message')).nativeElement as HTMLElement;
    expect(message.textContent).toContain('Failed to load');

    const retryButton = fixture.nativeElement.querySelector('button');
    expect(retryButton?.textContent).toContain('Retry');

    retryButton?.dispatchEvent(new Event('click'));
    expect(retrySpy).toHaveBeenCalledTimes(1);
  });

  it('should use icon button for inline retry variant', () => {
    const retrySpy = jasmine.createSpy('retry');
    component.variant.set('inline');
    component.error.set('Inline error');
    component.retry.set(retrySpy);

    fixture.detectChanges();

    const iconButton = fixture.debugElement.query(By.css('button[mat-icon-button]'));
    expect(iconButton).not.toBeNull();
    expect(iconButton.attributes['aria-label']).toBe('Retry');

    iconButton.triggerEventHandler('click');
    expect(retrySpy).toHaveBeenCalled();
  });
});
