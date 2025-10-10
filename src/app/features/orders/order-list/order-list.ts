import { CurrencyPipe, DatePipe, DecimalPipe, NgIf } from '@angular/common';
import { Component, DestroyRef, OnInit, TemplateRef, ViewChild, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

import { OrdersFacade } from '@features/orders/data-access/state/orders.facade';
import { Order } from '@shared/models/order.model';
import { PageRequest } from '@shared/models/page-request.model';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog';
import { OrderStatus } from '@shared/models/order-status.model';
import { SearchInput } from '@shared/components/search-input/search-input';
import { SearchEvent } from '@shared/models/search-event.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    SearchInput,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss',
})
export class OrderList implements OnInit {
  private readonly facade = inject(OrdersFacade);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  
  protected readonly displayedColumns = [
    'orderId',
    'customer',
    'orderDate',
    'requiredDate',
    'freight',
    'shipTo',
    'status',
    'actions',
  ] as const;

  protected readonly orders = this.facade.orders;
  protected readonly metadata = this.facade.metadata;
  protected readonly loading = this.facade.loading;
  protected readonly deletingIds = this.facade.deletingIds;
  protected readonly request = this.facade.request;
  protected readonly error = this.facade.error;

  @ViewChild('deleteDialog', { static: true })
  protected deleteDialog!: TemplateRef<Order>;

  ngOnInit(): void {
    this.facade.load(this.request());
  }

  protected onSearch(event: SearchEvent): void {
    this.facade.setQuery(event.query);
  }

  protected formatStatus(order: Order): OrderStatus {
    return order.shippedDate ? 'shipped' : 'pending';
  }

  protected getLength(): number {
    return this.metadata()?.totalRows ?? 0;
  }

  protected getPageIndex(): number {
    return (this.metadata()?.page ?? this.request().page) - 1;
  }

  protected getPageSize(): number {
    return this.metadata()?.rows ?? this.request().rows;
  }

  protected onPageChange(event: PageEvent): void {
    const request: PageRequest = {
      page: event.pageIndex + 1,
      rows: event.pageSize,
      offset: event.pageIndex * event.pageSize,
      query: this.request().query,
    };
    this.facade.load(request);
  }

  protected retry(): void {
    this.facade.load(this.request());
  }

  protected openDeleteDialog(order: Order): void {
    const data: ConfirmationDialogData<Order> = {
      title: 'Delete order',
      template: this.deleteDialog,
      context: order,
      confirmLabel: 'Delete',
      confirmColor: 'warn',
    };

    const ref = this.dialog.open(ConfirmationDialogComponent, {
      width: '420px',
      data,
    });

    ref
      .afterClosed()
      .pipe(filter((confirmed) => confirmed === true), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.facade.delete(order.orderId));
  }

  protected isDeleting(order: Order): boolean {
    return this.deletingIds().includes(order.orderId.toString());
  }
}
