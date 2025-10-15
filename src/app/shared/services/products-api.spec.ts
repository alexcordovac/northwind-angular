import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ProductsApi } from './products-api';
import { environment } from '@env/environment';
import { Product } from '@shared/models/product.model';
import { PagedResponse } from '@shared/models/paged-response.model';
import { PageRequest } from '@shared/models/page-request.model';

describe('ProductsApi', () => {
  let service: ProductsApi;
  let http: HttpTestingController;
  const baseUrl = `${environment.apiBaseUrl}/${environment.endpoints.products}`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ProductsApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should search products using the provided filters', () => {
    const request: PageRequest = { page: 1, rows: 50, query: 'chocolate', offset: 0 };
    const mockResponse: PagedResponse<Product> = {
      items: [],
      metadata: {
        page: 1,
        rows: 50,
        offset: 0,
        query: 'chocolate',
        totalRows: 0,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false,
      },
    };

    service.search(request).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = http.expectOne((httpReq) => httpReq.method === 'GET' && httpReq.url === baseUrl);
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('rows')).toBe('50');
    expect(req.request.params.get('query')).toBe('chocolate');

    req.flush(mockResponse);
  });
});
