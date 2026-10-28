export interface ShortenUrlRequest {
  fullUrl: string;
  customAlias?: string;
}

export interface ShortenUrlResponse {
  alias: string;
  fullUrl: string;
  shortUrl: string;
}

export interface UrlListItem {
  alias: string;
  fullUrl: string;
  shortUrl: string;
}

export interface PaginatedUrlResponse {
  items: UrlListItem[];
  totalCount: number;
  page: number;
  size: number;
}

export interface ApiError {
  error: string;
}
