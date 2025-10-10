import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { EmployeesApi } from './employees-api';

describe('EmployeesApi', () => {
  let service: EmployeesApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(EmployeesApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

