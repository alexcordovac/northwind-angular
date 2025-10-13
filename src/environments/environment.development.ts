export const environment = {
  production: false,
  apiBaseUrl: 'https://localhost:7171/api/v1',
  endpoints: {
    orders: 'orders',
    customers: 'customers',
    employees: 'employees',
    products: 'products'
  }
} as const;
