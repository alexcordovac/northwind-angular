export const environment = {
  production: true,
  apiBaseUrl: 'https://localhost:7170/api/v1',
  endpoints: {
    orders: 'orders',
    customers: 'customers',
    employees: 'employees',
    products: 'products'
  }
} as const;
