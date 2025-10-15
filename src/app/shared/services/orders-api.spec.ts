import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { OrdersApi } from './orders-api';
import { environment } from '@env/environment';
import { CreateOrder } from '@shared/models/create-order.model';
import { PagedResponse } from '@shared/models/paged-response.model';
import { Order } from '@shared/models/order.model';
import { PageRequest } from '@shared/models/page-request.model';

describe('OrdersApi', () => {
  let service: OrdersApi;
  let http: HttpTestingController;
  const baseUrl = `${environment.apiBaseUrl}/${environment.endpoints.orders}`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(OrdersApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should request the orders list with paging parameters', () => {
    const request: PageRequest = { page: 2, rows: 10, query: 'chai', offset: 5 };
    const mockResponse: PagedResponse<Order> = {
      items: [],
      metadata: {
        page: 2,
        rows: 10,
        offset: 5,
        query: 'chai',
        totalRows: 0,
        totalPages: 0,
        hasPrevious: true,
        hasNext: false,
      },
    };

    service.list(request).subscribe((value) => {
      expect(value).toEqual(mockResponse);
    });

    const req = http.expectOne((httpReq) => httpReq.method === 'GET' && httpReq.url === baseUrl);
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('rows')).toBe('10');
    expect(req.request.params.get('offset')).toBe('5');
    expect(req.request.params.get('query')).toBe('chai');

    req.flush(mockResponse);
  });

  it('should create a new order payload', () => {
    const payload: CreateOrder = {
      customerId: 'ALFKI',
      employeeId: 7,
      orderDate: new Date('2024-01-01T00:00:00.000Z').toISOString(),
      requiredDate: new Date('2024-01-10T00:00:00.000Z').toISOString(),
      freight: 42,
      shipName: 'Test Ship',
      shipAddress: '123 Any St',
      shipCity: 'Seattle',
      shipRegion: 'WA',
      shipPostalCode: '98101',
      shipCountry: 'USA',
      notes: 'Handle with care',
      details: [
        {
          productId: 1,
          unitPrice: 10,
          quantity: 2,
          discount: 0,
        },
      ],
    };

    const mockOrder = { orderId: 1000, ...payload } as unknown as Order;

    service.create(payload).subscribe((created) => {
      expect(created).toEqual(mockOrder);
    });

    const req = http.expectOne((httpReq) => httpReq.method === 'POST' && httpReq.url === baseUrl);
    expect(req.request.body).toEqual(payload);

    req.flush(mockOrder);
  });

  it('should delete an order by id', () => {
    const id = 42;
    service.delete(id).subscribe({
      next: (response) => {
        expect(response).toBeNull();
      },
    });

    const req = http.expectOne(`${baseUrl}/${id}`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
    
  });
});
