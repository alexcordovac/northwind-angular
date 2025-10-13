import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, EMPTY, map, of, switchMap, withLatestFrom } from 'rxjs';
import { ProductsApi } from '@shared/services/products-api';
import { OrderCreateActions } from './order-create.actions';
import { orderCreateFeature } from './order-create.reducer';
import { PageRequest } from '@shared/models/page-request.model';

@Injectable()
export class OrderCreateEffects {
  private readonly actions$ = inject(Actions);
  private readonly productsApi = inject(ProductsApi);
  private readonly store = inject(Store);

  readonly loadCatalog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderCreateActions.enter, OrderCreateActions.searchProducts, OrderCreateActions.loadNextPage),
      withLatestFrom(this.store.select(orderCreateFeature.selectOrderCreateState)),
      switchMap(([action, state]) => {
        const isLoadMore = action.type === OrderCreateActions.loadNextPage.type;
        if (isLoadMore && state.endReached) {
          return EMPTY;
        }

        const queryFromAction =
          action.type === OrderCreateActions.searchProducts.type ? action.query.trim() : state.query;
        const query = queryFromAction || '';
        const page = isLoadMore ? state.page + 1 : 1;
        const rows = state.rows;

        const request: PageRequest = {
          page,
          rows,
          offset: (page - 1) * rows,
          query: query || undefined,
        };

        return this.productsApi.search(request).pipe(
          map((response) => OrderCreateActions.loadProductsSuccess({ response, append: isLoadMore })),
          catchError((error: HttpErrorResponse | Error) =>
            of(OrderCreateActions.loadProductsFailure({ error: this.mapError(error) })),
          ),
        );
      }),
    ),
  );

  private mapError(error: HttpErrorResponse | Error): string {
    if (error instanceof HttpErrorResponse) {
      return error.error?.message ?? error.message ?? 'Unable to load products';
    }

    return error.message ?? 'Unable to load products';
  }
}
