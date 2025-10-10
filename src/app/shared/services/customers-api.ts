import { Injectable } from '@angular/core';
import { Customer } from '@shared/models/customer.model';
import { PageRequest } from '@shared/models/page-request.model';
import { BaseCrudService } from './base-crud';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomersApi extends BaseCrudService<Customer> {
  protected override endpoint = environment.endpoints.customers;

  search(request: PageRequest) {
    return this.list(request);
  }
}
