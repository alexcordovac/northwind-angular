import { createSelector } from '@ngrx/store';
import { ordersFeature } from './orders.reducer';

export const {
  selectOrdersState,
  selectData: selectOrders,
  selectMetadata: selectOrdersMetadata,
  selectLoading: selectOrdersLoading,
  selectCreating: selectOrdersCreating,
  selectDeletingIds: selectOrdersDeletingIds,
  selectError: selectOrdersError,
  selectRequest: selectOrdersRequest,
} = ordersFeature;

export const selectIsInitialLoad = createSelector(
  selectOrdersMetadata,
  (metadata) => !metadata
);
