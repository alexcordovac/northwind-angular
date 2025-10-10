import { Injectable } from '@angular/core';
import { Customer } from '../models/customer.model';
import { PageRequest } from '../models/page-request.model';
import { BaseCrudService } from './base-crud';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomersApi extends BaseCrudService<Customer> {
  protected override endpoint = environment.endpoints.customers;

  search(request: PageRequest) {
    return this.list(request);
  }
}
