import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { CustomersApi } from './customers-api';
import { environment } from '@env/environment';
import { Customer } from '@shared/models/customer.model';
import { PagedResponse } from '@shared/models/paged-response.model';
import { PageRequest } from '@shared/models/page-request.model';

describe('CustomersApi', () => {
  let service: CustomersApi;
  let http: HttpTestingController;
  const baseUrl = `${environment.apiBaseUrl}/${environment.endpoints.customers}`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(CustomersApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should search customers with the provided request params', () => {
    const request: PageRequest = { page: 1, rows: 20, query: 'alf', offset: 0 };
    const mockResponse: PagedResponse<Customer> = {
      items: [],
      metadata: {
        page: 1,
        rows: 20,
        offset: 0,
        query: 'alf',
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
    expect(req.request.params.get('rows')).toBe('20');
    expect(req.request.params.get('query')).toBe('alf');

    req.flush(mockResponse);
  });
});
