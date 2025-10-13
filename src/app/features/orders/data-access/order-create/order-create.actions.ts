import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { PagedResponse } from '@shared/models/paged-response.model';
import { Product } from '@shared/models/product.model';
import { OrderCreateProductSelection } from './order-create.models';

export const OrderCreateActions = createActionGroup({
  source: 'Order Create',
  events: {
    Enter: emptyProps(),
    'Search Products': props<{ query: string }>(),
    'Load Next Page': emptyProps(),
    'Load Products Success': props<{ response: PagedResponse<Product>; append: boolean }>(),
    'Load Products Failure': props<{ error: string }>(),
    'Select Product': props<{ product: Product }>(),
    'Remove Selected Product': props<{ productId: number }>(),
    'Update Selected Product Quantity': props<{ productId: number; quantity: number }>(),
    'Update Selected Product Discount': props<{ productId: number; discount: number }>(),
    'Update Selected Product Unit Price': props<{ productId: number; unitPrice: number }>(),
    'Hydrate Selection': props<{ selection: OrderCreateProductSelection[] }>(),
    'Clear Selection': emptyProps(),
    Reset: emptyProps(),
  },
});

