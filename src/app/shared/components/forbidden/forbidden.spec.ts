import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ForbiddenComponent } from './forbidden';

describe('ForbiddenComponent', () => {
  let fixture: ComponentFixture<ForbiddenComponent>;
  let component: ForbiddenComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForbiddenComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ForbiddenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the access denied message', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Access denied');
    expect(element.textContent).toContain('does not have the permissions');
  });

  it('should expose the support contact link', () => {
    const link = fixture.nativeElement.querySelector('.forbidden-card__link') as HTMLAnchorElement | null;
    expect(link?.getAttribute('href')).toBe('mailto:support@northwind.com');
  });
});
