import { Injectable } from '@angular/core';
import { BaseCrudService } from './base-crud';
import { Product } from '@shared/models/product.model';
import { PageRequest } from '@shared/models/page-request.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsApi extends BaseCrudService<Product> {
  protected override endpoint = environment.endpoints.products;

  search(request: PageRequest) {
    return this.list(request);
  }
}

