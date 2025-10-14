import { CommonModule } from '@angular/common';
import { Component, ElementRef, effect, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { OrdersFacade } from '../data-access/order-list/orders.facade';
import { CustomersApi } from '@shared/services/customers-api';
import { EmployeesApi } from '@shared/services/employees-api';
import { EntityLookupComponent } from '@shared/components/entity-lookup/entity-lookup';
import { PageRequest } from '@shared/models/page-request.model';
import { Customer } from '@shared/models/customer.model';
import { Employee } from '@shared/models/employee.model';
import { CreateOrder } from '@shared/models/create-order.model';
import { SearchInput } from '@shared/components/search-input/search-input';
import { SearchEvent } from '@shared/models/search-event.model';
import { OrderCreateFacade } from '../data-access/order-create/order-create.facade';
import { Product } from '@shared/models/product.model';
import { OrderCreateProductSelection } from '../data-access/order-create/order-create.models';
import { LoadingState } from '@shared/components/loading-state/loading-state';

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
    MatFormFieldModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    EntityLookupComponent,
    SearchInput,
    LoadingState,
  ],
  templateUrl: './order-create.html',
  styleUrl: './order-create.scss',
})
export class OrderCreate implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(OrdersFacade);
  private readonly customersApi = inject(CustomersApi);
  private readonly employeesApi = inject(EmployeesApi);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly orderCreateProducts = inject(OrderCreateFacade);

  @ViewChild('catalogList') private catalogList?: ElementRef<HTMLDivElement>;
  private hasHandledInitialSearch = false;
  private lastSearchTerm = '';
  protected readonly retryCatalog = () => {
    this.orderCreateProducts.search(this.lastSearchTerm);
  };

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

  protected readonly productCatalog = this.orderCreateProducts.catalog;
  protected readonly productCatalogLoading = this.orderCreateProducts.loading;
  protected readonly productError = this.orderCreateProducts.error;
  protected readonly selectedProducts = this.orderCreateProducts.selected;
  protected readonly selectedCount = this.orderCreateProducts.selectedCount;
  protected readonly selectedSubtotal = this.orderCreateProducts.selectedSubtotal;
  protected readonly selectedIds = this.orderCreateProducts.selectedIds;
  protected readonly canLoadMore = this.orderCreateProducts.canLoadMore;
  protected readonly hasSelection = this.orderCreateProducts.hasSelection;
  protected readonly retryProductCatalog = () => {
    const query = this.lastSearchTerm ?? '';
    this.orderCreateProducts.search(query);
  };

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

    effect(() => {
      const productError = this.productError();
      if (productError) {
        this.snackBar.open(productError, 'Dismiss', { duration: 3500 });
      }
    });
  }

  ngOnInit(): void {
    this.orderCreateProducts.enter();
  }

  ngOnDestroy(): void {
    this.orderCreateProducts.reset();
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const selections = this.orderCreateProducts.selected();
    if (!selections.length) {
      this.snackBar.open('Add at least one product to create an order.', 'Dismiss', { duration: 3000 });
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
      details: selections.map((item) => ({
        productId: item.productId,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        discount: item.discount,
      })),
    };

    this.facade.create(payload);
  }

  protected navigateBack(): void {
    this.orderCreateProducts.reset();
    this.router.navigate(['/orders']);
  }

  protected onProductSearch(event: SearchEvent): void {
    const trimmed = event.query.trim();

    if (!this.hasHandledInitialSearch) {
      this.hasHandledInitialSearch = true;
      this.lastSearchTerm = trimmed;
      return;
    }

    if (trimmed === this.lastSearchTerm) {
      return;
    }

    this.lastSearchTerm = trimmed;
    this.orderCreateProducts.search(trimmed);
    queueMicrotask(() => this.catalogList?.nativeElement.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  protected onCatalogScroll(event: Event): void {
    const container = event.target as HTMLElement | null;
    if (!container) {
      return;
    }

    if (this.productCatalogLoading()) {
      return;
    }

    const distanceFromBottom = container.scrollHeight - (container.scrollTop + container.clientHeight);
    if (distanceFromBottom <= 160 && this.canLoadMore()) {
      this.orderCreateProducts.loadNextPage();
    }
  }

  protected addProduct(product: Product): void {
    if (this.isProductSelected(product.productId)) {
      return;
    }
    this.orderCreateProducts.selectProduct(product);
  }

  protected removeProduct(productId: number): void {
    this.orderCreateProducts.removeProduct(productId);
  }

  protected clearSelection(): void {
    this.orderCreateProducts.clearSelection();
  }

  protected onQuantityInput(productId: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = Number.parseInt(input.value, 10);
    this.orderCreateProducts.updateQuantity(productId, Number.isFinite(value) ? value : 1);
  }

  protected onDiscountInput(productId: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const rawValue = Number.parseFloat(input.value);
    const normalized = Number.isFinite(rawValue) ? rawValue / 100 : 0;
    this.orderCreateProducts.updateDiscount(productId, normalized);
  }

  protected onUnitPriceInput(productId: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = Number.parseFloat(input.value);
    this.orderCreateProducts.updateUnitPrice(productId, Number.isFinite(value) ? value : 0);
  }

  protected lineTotal(item: OrderCreateProductSelection): number {
    return item.unitPrice * item.quantity * (1 - item.discount);
  }

  protected isProductSelected(productId: number): boolean {
    return this.selectedIds().has(productId);
  }
}
