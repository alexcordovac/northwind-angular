import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, debounceTime, map, mergeMap, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { OrdersApi } from '@features/orders/services/orders-api';
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
            of(OrdersActions.loadOrdersFailure({ error: error.message ?? 'Unable to load orders' }))
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
            of(OrdersActions.deleteOrderFailure({ orderId, error: error.message ?? 'Unable to delete order' }))
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
            of(OrdersActions.createOrderFailure({ error: error.message ?? 'Unable to create order' }))
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
