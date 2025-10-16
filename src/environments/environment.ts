export const environment = {
  production: true,
  apiBaseUrl: 'https://localhost:7170/api/v1',
  endpoints: {
    orders: 'orders',
    customers: 'customers',
    employees: 'employees',
    products: 'products'
  },
  auth: {
    keycloak: {
      url: 'http://localhost:8080',
      redirectUri: 'http://localhost:4200',
      postLogoutRedirectUri: 'http://localhost:4200/logout',
      realm: 'northwind',
      clientId: 'northwind-ng'
    }
  }
} as const;
