import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Product } from '@shared/models/product.model';
import { OrderCreateProductSelection } from './order-create.models';
import { OrderCreateActions } from './order-create.actions';

export interface OrderCreateState {
  query: string;
  products: Product[];
  loading: boolean;
  page: number;
  rows: number;
  totalRows: number;
  endReached: boolean;
  error: string | null;
  selected: OrderCreateProductSelection[];
}

const DEFAULT_ROWS = 20;

const initialState: OrderCreateState = {
  query: '',
  products: [],
  loading: false,
  page: 0,
  rows: DEFAULT_ROWS,
  totalRows: 0,
  endReached: false,
  error: null,
  selected: [],
};

const reducer = createReducer(
  initialState,
  on(OrderCreateActions.enter, (state) =>
    state.loading
      ? state
      : {
          ...state,
          loading: true,
          page: 0,
          endReached: false,
          error: null,
          products: [],
        },
  ),
  on(OrderCreateActions.searchProducts, (state, { query }) => {
    const trimmedQuery = query.trim();
    const sameQuery = state.query === trimmedQuery;

    return {
      ...state,
      loading: true,
      query: trimmedQuery,
      page: 0,
      totalRows: sameQuery ? state.totalRows : 0,
      endReached: false,
      error: null,
      products: sameQuery ? state.products : [],
    };
  }),
  on(OrderCreateActions.loadNextPage, (state) =>
    state.loading || state.endReached
      ? state
      : {
          ...state,
          loading: true,
          error: null,
        },
  ),
  on(OrderCreateActions.loadProductsSuccess, (state, { response, append }) => {
    const { items, metadata } = response;
    const mergedProducts = append ? mergeProducts(state.products, items) : items;

    return {
      ...state,
      loading: false,
      products: mergedProducts,
      page: metadata.page,
      rows: metadata.rows ?? state.rows,
      totalRows: metadata.totalRows,
      endReached: !metadata.hasNext,
      query: metadata.query ?? state.query,
      error: null,
    };
  }),
  on(OrderCreateActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(OrderCreateActions.selectProduct, (state, { product }) => {
    if (state.selected.some((item) => item.productId === product.productId)) {
      return state;
    }

    const selection: OrderCreateProductSelection = {
      productId: product.productId,
      productName: product.productName,
      unitPrice: Number(product.unitPrice ?? 0),
      quantity: 1,
      discount: 0,
      product,
      maxAvailableUnits: product.unitsInStock ?? null,
    };

    return {
      ...state,
      selected: [...state.selected, selection],
    };
  }),
  on(OrderCreateActions.removeSelectedProduct, (state, { productId }) => ({
    ...state,
    selected: state.selected.filter((item) => item.productId !== productId),
  })),
  on(OrderCreateActions.updateSelectedProductQuantity, (state, { productId, quantity }) => ({
    ...state,
    selected: state.selected.map((item) =>
      item.productId === productId ? { ...item, quantity: Math.max(1, Math.floor(quantity)) } : item,
    ),
  })),
  on(OrderCreateActions.updateSelectedProductDiscount, (state, { productId, discount }) => ({
    ...state,
    selected: state.selected.map((item) =>
      item.productId === productId ? { ...item, discount: clamp(discount, 0, 1) } : item,
    ),
  })),
  on(OrderCreateActions.updateSelectedProductUnitPrice, (state, { productId, unitPrice }) => ({
    ...state,
    selected: state.selected.map((item) =>
      item.productId === productId ? { ...item, unitPrice: Math.max(0, roundTo(unitPrice, 2)) } : item,
    ),
  })),
  on(OrderCreateActions.clearSelection, (state) => ({
    ...state,
    selected: [],
  })),
  on(OrderCreateActions.hydrateSelection, (state, { selection }) => ({
    ...state,
    selected: selection,
  })),
  on(OrderCreateActions.reset, () => initialState),
);

export const orderCreateFeature = createFeature({
  name: 'orderCreate',
  reducer,
  extraSelectors: ({ selectSelected, selectProducts, selectEndReached, selectTotalRows, selectLoading }) => {
    const selectSelectedCount = createSelector(selectSelected, (selected) => selected.length);
    const selectSelectedIds = createSelector(selectSelected, (selected) => new Set(selected.map((item) => item.productId)));
    const selectSelectedSubtotal = createSelector(selectSelected, (selected) =>
      selected.reduce((total, item) => total + item.unitPrice * item.quantity * (1 - item.discount), 0),
    );
    const selectCanLoadMore = createSelector(selectEndReached, selectLoading, (endReached, loading) => !endReached && !loading);
    const selectCatalogEmpty = createSelector(selectProducts, (products) => products.length === 0);
    const selectHasSelection = createSelector(selectSelected, (selected) => selected.length > 0);
    const selectTotalUniqueProducts = createSelector(selectTotalRows, (totalRows) => totalRows);

    return {
      selectSelectedCount,
      selectSelectedIds,
      selectSelectedSubtotal,
      selectCanLoadMore,
      selectCatalogEmpty,
      selectHasSelection,
      selectTotalUniqueProducts,
    };
  },
});

function mergeProducts(existing: Product[], incoming: Product[]): Product[] {
  if (!existing.length) {
    return incoming;
  }

  const existingIds = new Set(existing.map((item) => item.productId));
  const filteredIncoming = incoming.filter((item) => !existingIds.has(item.productId));
  return [...existing, ...filteredIncoming];
}

function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

function roundTo(value: number, precision: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}
