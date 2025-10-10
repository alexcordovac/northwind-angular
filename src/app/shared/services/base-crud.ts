import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '@env/environment';
import { PageRequest } from '../models/page-request.model';
import { PagedResponse } from '../models/paged-response.model';

export abstract class BaseCrudService<TEntity, TCreate = Partial<TEntity>> {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  protected abstract endpoint: string;

  protected buildUrl(resourcePath = ''): string {
    const normalized = resourcePath ? `/${resourcePath}` : '';
    return `${this.baseUrl}/${this.endpoint}${normalized}`;
  }

  protected buildPageParams(request?: PageRequest): HttpParams {
    let params = new HttpParams();
    if (!request) {
      return params;
    }

    if (request.page !== undefined) {
      params = params.set('page', request.page);
    }

    if (request.rows !== undefined) {
      params = params.set('rows', request.rows);
    }

    if (request.offset !== undefined) {
      params = params.set('offset', request.offset);
    }

    if (request.query) {
      params = params.set('query', request.query);
    }

    return params;
  }

  list(request?: PageRequest) {
    const params = this.buildPageParams(request);
    return this.http.get<PagedResponse<TEntity>>(this.buildUrl(), { params });
  }

  create(payload: TCreate) {
    return this.http.post<TEntity>(this.buildUrl(), payload);
  }

  delete(id: number | string) {
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete<void>(this.buildUrl(), { params });
  }

  protected get httpClient(): HttpClient {
    return this.http;
  }
}
