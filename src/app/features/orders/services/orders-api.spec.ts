import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { OrdersApi } from './orders-api';

describe('OrdersApi', () => {
  let service: OrdersApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(OrdersApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
