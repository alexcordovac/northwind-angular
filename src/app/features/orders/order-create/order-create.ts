import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { OrdersFacade } from '../data-access/state/orders.facade';
import { CustomersApi } from '@shared/services/customers-api';
import { EmployeesApi } from '@shared/services/employees-api';
import { EntityLookupComponent } from '@shared/components/entity-lookup/entity-lookup';
import { PageRequest } from '@shared/models/page-request.model';
import { Customer } from '@shared/models/customer.model';
import { Employee } from '@shared/models/employee.model';
import { CreateOrder } from '@shared/models/create-order.model';
@Component({
  selector: 'app-order-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    EntityLookupComponent,
  ],
  templateUrl: './order-create.html',
  styleUrl: './order-create.scss',
})
export class OrderCreate {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(OrdersFacade);
  private readonly customersApi = inject(CustomersApi);
  private readonly employeesApi = inject(EmployeesApi);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly form = this.fb.group({
    customerId: this.fb.control<string | number | null>(null, Validators.required),
    employeeId: this.fb.control<number | null>(null, Validators.required),
    orderDate: this.fb.control<Date | null>(new Date(), Validators.required),
    requiredDate: this.fb.control<Date | null>(null, Validators.required),
    freight: this.fb.control<number | null>(0, [Validators.required, Validators.min(0)]),
    shipName: this.fb.control<string | null>(null, Validators.required),
    shipAddress: this.fb.control<string | null>(null),
    shipCity: this.fb.control<string | null>(null, Validators.required),
    shipRegion: this.fb.control<string | null>(null),
    shipPostalCode: this.fb.control<string | null>(null),
    shipCountry: this.fb.control<string | null>(null, Validators.required),
    notes: this.fb.control<string | null>(null),
  });

  protected readonly creating = this.facade.creating;

  protected readonly loadCustomers = (request: PageRequest) =>
    this.customersApi.search({ page: 1, rows: 20, offset: 0, ...request });
  protected readonly loadEmployees = (request: PageRequest) =>
    this.employeesApi.search({ page: 1, rows: 20, offset: 0, ...request });

  protected readonly customerDisplay = (customer: Customer | null) =>
    customer ? customer.companyName : '';
  protected readonly employeeDisplay = (employee: Employee | null) =>
    employee ? `${employee.firstName} ${employee.lastName}` : '';
  protected readonly employeeValue = (employee: Employee) => employee.employeeId;
  protected readonly customerValue = (customer: Customer) => customer.customerId;

  constructor() {
    effect(
      () => {
        const error = this.facade.error();
        if (error) {
          this.snackBar.open(error, 'Dismiss', { duration: 4000 });
          this.facade.resetError();
        }
      }
    );
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: CreateOrder = {
      customerId: value.customerId!,
      employeeId: value.employeeId!,
      orderDate: (value.orderDate ?? new Date()).toISOString(),
      requiredDate: (value.requiredDate ?? new Date()).toISOString(),
      freight: Number(value.freight ?? 0),
      shipName: value.shipName ?? '',
      shipAddress: value.shipAddress,
      shipCity: value.shipCity ?? '',
      shipRegion: value.shipRegion,
      shipPostalCode: value.shipPostalCode,
      shipCountry: value.shipCountry ?? '',
      notes: value.notes,
    };

    this.facade.create(payload);
  }

  protected navigateBack(): void {
    this.router.navigate(['/orders']);
  }
}
