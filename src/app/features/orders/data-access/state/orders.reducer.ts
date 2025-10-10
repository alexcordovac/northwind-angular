import { createFeature, createReducer, on } from '@ngrx/store';
import { PageMetadata } from '../../../../shared/models/page-metadata.model';
import { PageRequest } from '../../../../shared/models/page-request.model';
import { Order } from '../../../../shared/models/order.model';
import { OrdersActions } from './orders.actions';

export const ordersFeatureKey = 'orders';

export interface OrdersState {
  data: Order[];
  metadata: PageMetadata | null;
  loading: boolean;
  creating: boolean;
  deletingIds: Array<number | string>;
  error: string | null;
  request: Required<PageRequest>;
}

const initialRequest: Required<PageRequest> = {
  page: 1,
  rows: 25,
  offset: 0,
  query: null,
};

export const ordersInitialState: OrdersState = {
  data: [],
  metadata: null,
  loading: false,
  creating: false,
  deletingIds: [],
  error: null,
  request: initialRequest,
};

export const ordersReducer = createReducer(
  ordersInitialState,
  on(OrdersActions.loadOrders, (state, { request }) => ({
    ...state,
    loading: true,
    error: null,
    request: {
      ...state.request,
      ...request,
      query: request?.query ?? state.request.query ?? null,
    },
  })),
  on(OrdersActions.loadOrdersSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    data: response.items,
    metadata: response.metadata,
  })),
  on(OrdersActions.loadOrdersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(OrdersActions.deleteOrder, (state, { orderId }) => ({
    ...state,
    deletingIds: [...state.deletingIds, orderId.toString()],
    error: null,
  })),
  on(OrdersActions.deleteOrderSuccess, (state, { orderId }) => {
    const normalized = orderId.toString();
    return {
      ...state,
      deletingIds: state.deletingIds.filter((id) => id !== normalized),
      data: state.data.filter((order) => order.orderId.toString() !== normalized),
    };
  }),
  on(OrdersActions.deleteOrderFailure, (state, { orderId, error }) => ({
    ...state,
    deletingIds: state.deletingIds.filter((id) => id !== orderId.toString()),
    error,
  })),
  on(OrdersActions.createOrder, (state) => ({
    ...state,
    creating: true,
    error: null,
  })),
  on(OrdersActions.createOrderSuccess, (state) => ({
    ...state,
    creating: false,
    error: null,
  })),
  on(OrdersActions.createOrderFailure, (state, { error }) => ({
    ...state,
    creating: false,
    error,
  })),
  on(OrdersActions.setQuery, (state, { query }) => ({
    ...state,
    request: {
      ...state.request,
      page: 1,
      offset: 0,
      query: query.length ? query : null,
    },
  })),
  on(OrdersActions.resetError, (state) => ({
    ...state,
    error: null,
  }))
);

export const ordersFeature = createFeature({
  name: ordersFeatureKey,
  reducer: ordersReducer,
});
