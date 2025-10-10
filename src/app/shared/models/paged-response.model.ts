import { PageMetadata } from './page-metadata.model';

export interface PagedResponse<T> {
  items: T[];
  metadata: PageMetadata;
}
