import { CreateOrderDetail } from '@shared/models/order-detail.model';
import { Product } from '@shared/models/product.model';

export interface OrderCreateProductSelection extends CreateOrderDetail {
  productName: string;
  product?: Product | null;
  maxAvailableUnits?: number | null;
}

