export interface PageMetadata {
  page: number;
  rows: number;
  offset: number;
  query: string | null;
  totalRows: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
