import { inject, Injectable, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { CreateOrder } from '@shared/models/create-order.model';
import { Order } from '@shared/models/order.model';
import { PageRequest } from '@shared/models/page-request.model';
import { OrdersActions } from './orders.actions';
import {
  selectIsInitialLoad,
  selectOrders,
  selectOrdersCreating,
  selectOrdersDeletingIds,
  selectOrdersError,
  selectOrdersLoading,
  selectOrdersMetadata,
  selectOrdersRequest,
} from './orders.selectors';

@Injectable({
  providedIn: 'root',
})
export class OrdersFacade {
  private readonly store = inject(Store);

  readonly orders = toSignal(this.store.select(selectOrders), { initialValue: [] as Order[] });
  readonly metadata = toSignal(this.store.select(selectOrdersMetadata), { initialValue: null });
  readonly loading = toSignal(this.store.select(selectOrdersLoading), { initialValue: false });
  readonly creating = toSignal(this.store.select(selectOrdersCreating), { initialValue: false });
  readonly deletingIds = toSignal(this.store.select(selectOrdersDeletingIds), {
    initialValue: [] as Array<string>,
  });
  readonly error = toSignal(this.store.select(selectOrdersError), { initialValue: null });
  readonly request = toSignal(this.store.select(selectOrdersRequest), {
    initialValue: {
      page: 1,
      rows: 25,
      offset: 0,
      query: null,
    },
  });
  readonly initialLoadPending = toSignal(this.store.select(selectIsInitialLoad), {
    initialValue: true,
  });

  load(request?: PageRequest) {
    this.store.dispatch(OrdersActions.loadOrders({ request }));
  }

  refresh() {
    this.store.dispatch(OrdersActions.refreshOrders());
  }

  setQuery(query: string) {
    this.store.dispatch(OrdersActions.setQuery({ query }));
  }

  delete(orderId: number | string) {
    this.store.dispatch(OrdersActions.deleteOrder({ orderId }));
  }

  create(payload: CreateOrder) {
    this.store.dispatch(OrdersActions.createOrder({ payload }));
  }

  resetError() {
    this.store.dispatch(OrdersActions.resetError());
  }
}
