export interface CreateOrder {
  customerId: string | number;
  employeeId: number;
  orderDate: string;
  requiredDate: string;
  freight: number;
  shipName: string;
  shipAddress?: string | null;
  shipCity: string;
  shipRegion?: string | null;
  shipPostalCode?: string | null;
  shipCountry: string;
  notes?: string | null;
}
