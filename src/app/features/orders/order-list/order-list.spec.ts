import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';

import { OrderList } from './order-list';
import { ordersFeature, ordersInitialState } from '../data-access/state/orders.reducer';
import { notificationsFeature } from '@core/state/notifications/notifications.reducer';

describe('OrderList', () => {
  let component: OrderList;
  let fixture: ComponentFixture<OrderList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderList],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideMockStore({
          initialState: {
            [ordersFeature.name]: ordersInitialState,
            [notificationsFeature.name]: { message: null },
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

