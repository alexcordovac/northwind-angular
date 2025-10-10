import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { CustomersApi } from './customers-api';

describe('CustomersApi', () => {
  let service: CustomersApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CustomersApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

