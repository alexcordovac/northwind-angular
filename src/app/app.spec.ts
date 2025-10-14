import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { App } from './app';
import { routes } from './app.routes';
import { notificationsFeature } from '@core/state/notifications/notifications.reducer';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes),
        provideMockStore({
          initialState: {
            [notificationsFeature.name]: { message: null },
          },
        }),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the topbar title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement as HTMLElement;
    expect(compiled.querySelector('.topbar__title')?.textContent).toContain('Operations');
  });
});
