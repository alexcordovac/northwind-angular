import { Routes } from '@angular/router';
import { canActivateAuthRole } from './guards/auth-role.guard';

export const routes: Routes = [
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   redirectTo: 'orders',
  // },
  {
    path: 'orders',
    data: { role: 'product_manager, sales_representative, warehouse_clerk' },
    canActivate: [canActivateAuthRole],
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
    data: { role: 'product_manager, sales_representative, warehouse_clerk' },
    canActivate: [canActivateAuthRole],
    loadComponent: () =>
      import('./features/products/product-list/product-list').then((m) => m.ProductList),
  },
  {
    path: 'forbidden',
    loadComponent: () => import('./shared/components/forbidden/forbidden').then((m) => m.ForbiddenComponent),
  }
  // {
  //   path: '**',
  //   redirectTo: 'orders',
  // },
];
