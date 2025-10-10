import { Injectable } from '@angular/core';
import { CreateOrder } from '../../../shared/models/create-order.model';
import { Order } from '../../../shared/models/order.model';
import { PageRequest } from '../../../shared/models/page-request.model';
import { BaseCrudService } from '../../../shared/services/base-crud';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdersApi extends BaseCrudService<Order, CreateOrder> {
  protected override endpoint = environment.endpoints.orders;

  override list(request?: PageRequest) {
    return super.list(request);
  }

  override create(payload: CreateOrder) {
    return super.create(payload);
  }

  override delete(id: number | string) {
    return super.delete(id);
  }
}
