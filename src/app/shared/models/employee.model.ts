export interface Employee {
  employeeId: number;
  lastName: string;
  firstName: string;
  title: string | null;
  titleOfCourtesy: string | null;
  birthDate: string | null;
  hireDate: string | null;
  address: string | null;
  city: string | null;
  region: string | null;
  postalCode: string | null;
  country: string | null;
  homePhone: string | null;
  extension: string | null;
  photo: string | null;
  notes: string | null;
  reportsTo: number | null;
  photoPath: string | null;
}
