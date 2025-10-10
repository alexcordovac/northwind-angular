export const environment = {
  production: true,
  apiBaseUrl: 'https://localhost:7170',
  endpoints: {
    orders: 'orders',
    customers: 'customers',
    employees: 'employees'
  }
} as const;
