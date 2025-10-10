export interface PageRequest {
  page?: number;
  rows?: number;
  offset?: number;
  query?: string | null;
}
