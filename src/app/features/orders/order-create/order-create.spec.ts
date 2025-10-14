import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';

import { OrderCreate } from './order-create';
import { CustomersApi } from '@shared/services/customers-api';
import { EmployeesApi } from '@shared/services/employees-api';
import { ordersFeature, ordersInitialState } from '../data-access/order-list/orders.reducer';

const emptyMetadata = {
  page: 1,
  rows: 0,
  offset: 0,
  query: null,
  totalRows: 0,
  totalPages: 0,
  hasPrevious: false,
  hasNext: false,
};

class CustomersApiStub {
  search() {
    return of({ items: [], metadata: emptyMetadata });
  }
}

class EmployeesApiStub {
  search() {
    return of({ items: [], metadata: emptyMetadata });
  }
}

describe('OrderCreate', () => {
  let component: OrderCreate;
  let fixture: ComponentFixture<OrderCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderCreate],
      providers: [
        provideZonelessChangeDetection(),
        provideMockStore({
          initialState: {
            [ordersFeature.name]: ordersInitialState,
          },
        }),
        { provide: CustomersApi, useClass: CustomersApiStub },
        { provide: EmployeesApi, useClass: EmployeesApiStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
