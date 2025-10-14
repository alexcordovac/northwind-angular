import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { OrdersEffects } from './features/orders/data-access/order-list/orders.effects';
import { ordersFeature } from './features/orders/data-access/order-list/orders.reducer';
import { orderCreateFeature } from './features/orders/data-access/order-create/order-create.reducer';
import { notificationsFeature } from '@core/state/notifications/notifications.reducer';
import { OrderCreateEffects } from './features/orders/data-access/order-create/order-create.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideStore(),
    provideState(ordersFeature),
    provideState(orderCreateFeature),
    provideState(notificationsFeature),
    provideEffects(OrdersEffects, OrderCreateEffects),
    provideHttpClient(withInterceptorsFromDi()),
  ],
};
