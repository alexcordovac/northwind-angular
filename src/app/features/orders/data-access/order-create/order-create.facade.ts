import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { OrderCreateActions } from './order-create.actions';
import { orderCreateFeature } from './order-create.reducer';
import { Product } from '@shared/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class OrderCreateFacade {
  private readonly store = inject(Store);

  readonly catalog = toSignal(this.store.select(orderCreateFeature.selectProducts), { initialValue: [] });
  readonly loading = toSignal(this.store.select(orderCreateFeature.selectLoading), { initialValue: false });
  readonly error = toSignal(this.store.select(orderCreateFeature.selectError), { initialValue: null });
  readonly selected = toSignal(this.store.select(orderCreateFeature.selectSelected), { initialValue: [] });
  readonly selectedCount = toSignal(this.store.select(orderCreateFeature.selectSelectedCount), { initialValue: 0 });
  readonly selectedSubtotal = toSignal(this.store.select(orderCreateFeature.selectSelectedSubtotal), {
    initialValue: 0,
  });
  readonly selectedIds = toSignal(this.store.select(orderCreateFeature.selectSelectedIds), {
    initialValue: new Set<number>(),
  });
  readonly canLoadMore = toSignal(this.store.select(orderCreateFeature.selectCanLoadMore), { initialValue: false });
  readonly catalogEmpty = toSignal(this.store.select(orderCreateFeature.selectCatalogEmpty), { initialValue: true });
  readonly hasSelection = toSignal(this.store.select(orderCreateFeature.selectHasSelection), { initialValue: false });
  readonly totalProducts = toSignal(this.store.select(orderCreateFeature.selectTotalUniqueProducts), {
    initialValue: 0,
  });

  enter(): void {
    this.store.dispatch(OrderCreateActions.enter());
  }

  search(query: string): void {
    this.store.dispatch(OrderCreateActions.searchProducts({ query }));
  }

  loadNextPage(): void {
    this.store.dispatch(OrderCreateActions.loadNextPage());
  }

  selectProduct(product: Product): void {
    this.store.dispatch(OrderCreateActions.selectProduct({ product }));
  }

  removeProduct(productId: number): void {
    this.store.dispatch(OrderCreateActions.removeSelectedProduct({ productId }));
  }

  updateQuantity(productId: number, quantity: number): void {
    this.store.dispatch(OrderCreateActions.updateSelectedProductQuantity({ productId, quantity }));
  }

  updateDiscount(productId: number, discount: number): void {
    this.store.dispatch(OrderCreateActions.updateSelectedProductDiscount({ productId, discount }));
  }

  updateUnitPrice(productId: number, unitPrice: number): void {
    this.store.dispatch(OrderCreateActions.updateSelectedProductUnitPrice({ productId, unitPrice }));
  }

  clearSelection(): void {
    this.store.dispatch(OrderCreateActions.clearSelection());
  }

  reset(): void {
    this.store.dispatch(OrderCreateActions.reset());
  }
}

