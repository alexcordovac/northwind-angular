export interface Order {
  orderId: number;
  customerId: string | number;
  customerCompanyName: string;
  orderDate: string;
  requiredDate: string;
  shippedDate: string | null;
  freight: number;
  shipName: string;
  shipCity: string;
  shipCountry: string;
}
