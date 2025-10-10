import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'orders',
  },
  {
    path: 'orders',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/orders/order-list/order-list').then((m) => m.OrderList),
      },
      {
        path: 'create',
        loadComponent: () => import('./features/orders/order-create/order-create').then((m) => m.OrderCreate),
      },
    ],
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/product-list/product-list').then((m) => m.ProductList),
  },
  {
    path: '**',
    redirectTo: 'orders',
  },
];
