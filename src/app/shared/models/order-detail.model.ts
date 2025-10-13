import { Product } from './product.model';

export interface OrderDetail {
  orderId: number;
  productId: number;
  unitPrice: number;
  quantity: number;
  discount: number;
  product?: Product | null;
}

export interface CreateOrderDetail {
  productId: number;
  unitPrice: number;
  quantity: number;
  discount: number;
}

