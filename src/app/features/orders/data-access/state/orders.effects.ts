import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, debounceTime, map, mergeMap, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { OrdersApi } from '@shared/services/orders-api';
import { OrdersActions } from './orders.actions';
import { selectOrdersRequest } from './orders.selectors';

@Injectable()
export class OrdersEffects {
  private readonly actions$ = inject(Actions);
  private readonly ordersApi = inject(OrdersApi);
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.loadOrders, OrdersActions.refreshOrders),
      withLatestFrom(this.store.select(selectOrdersRequest)),
      switchMap(([action, currentRequest]) => {
        const request = 'request' in action && action.request ? action.request : currentRequest;
        return this.ordersApi.list(request).pipe(
          map((response) => OrdersActions.loadOrdersSuccess({ response })),
          catchError((error) =>
            of(OrdersActions.loadOrdersFailure({ error: mapHttpErrorMessage(error, 'Unable to load orders') }))
          )
        );
      })
    )
  );

  setQuery$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.setQuery),
      debounceTime(300),
      map(() => OrdersActions.loadOrders({}))
    )
  );

  deleteOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.deleteOrder),
      withLatestFrom(this.store.select(selectOrdersRequest)),
      mergeMap(([{ orderId }, request]) =>
        this.ordersApi.delete(orderId).pipe(
          map(() => OrdersActions.deleteOrderSuccess({ orderId })),
          switchMap((action) => [action, OrdersActions.loadOrders({ request })]),
          catchError((error) =>
            of(
              OrdersActions.deleteOrderFailure({
                orderId,
                error: mapHttpErrorMessage(error, 'Unable to delete order'),
              })
            )
          )
        )
      )
    )
  );

  createOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.createOrder),
      withLatestFrom(this.store.select(selectOrdersRequest)),
      mergeMap(([{ payload }, request]) =>
        this.ordersApi.create(payload).pipe(
          map((order) => OrdersActions.createOrderSuccess({ order })),
          switchMap((action) => [action, OrdersActions.loadOrders({ request })]),
          catchError((error) =>
            of(OrdersActions.createOrderFailure({ error: mapHttpErrorMessage(error, 'Unable to create order') }))
          )
        )
      )
    )
  );

  createOrderSuccessNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OrdersActions.createOrderSuccess),
        tap(() => this.snackBar.open('Order created successfully', 'Dismiss', { duration: 3000 }))
      ),
    { dispatch: false }
  );

  navigateAfterCreate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OrdersActions.createOrderSuccess),
        tap(() => this.router.navigate(['/orders']))
      ),
    { dispatch: false }
  );
}

function mapHttpErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpErrorResponse) {
    const status = error.status;
    const serverMessage =
      typeof error.error === 'string'
        ? error.error
        : error.error?.message ?? error.error?.title ?? error.error?.detail ?? null;

    if (status === 0) {
      return 'We could not reach the server. Check your network connection and try again.';
    }

    if (status >= 500) {
      return 'The server encountered a problem. Please try again later.';
    }

    if (status === 404) {
      return 'The requested resource was not found.';
    }

    if (status === 401 || status === 403) {
      return 'You do not have permission to perform this action.';
    }

    if (status >= 400) {
      return serverMessage ?? 'The request could not be processed. Please review the input and try again.';
    }

    return serverMessage ?? fallback;
  }

  return fallback;
}
