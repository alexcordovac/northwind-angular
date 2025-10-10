import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CreateOrder } from '@shared/models/create-order.model';
import { Order } from '@shared/models/order.model';
import { PageRequest } from '@shared/models/page-request.model';
import { PagedResponse } from '@shared/models/paged-response.model';

export const OrdersActions = createActionGroup({
  source: 'Orders',
  events: {
    'Load Orders': props<{ request?: PageRequest }>(),
    'Load Orders Success': props<{ response: PagedResponse<Order> }>(),
    'Load Orders Failure': props<{ error: string }>(),
    'Delete Order': props<{ orderId: number | string }>(),
    'Delete Order Success': props<{ orderId: number | string }>(),
    'Delete Order Failure': props<{ orderId: number | string; error: string }>(),
    'Create Order': props<{ payload: CreateOrder }>(),
    'Create Order Success': props<{ order: Order }>(),
    'Create Order Failure': props<{ error: string }>(),
    'Set Query': props<{ query: string }>(),
    'Reset Error': emptyProps(),
    'Refresh Orders': emptyProps(),
  },
});
