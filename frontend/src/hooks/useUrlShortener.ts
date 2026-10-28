import { useState, useCallback, useEffect } from 'react';
import { api } from '../services/api';
import type { ShortenUrlResponse, UrlListItem } from '../types/api';

interface UseUrlShortenerReturn {
  urls: UrlListItem[];
  loading: boolean;
  error: string | null;
  lastCreated: ShortenUrlResponse | null;
  currentPage: number;
  pageSize: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  goToPage: (page: number) => Promise<void>;
  previousPage: () => Promise<void>;
  nextPage: () => Promise<void>;
  shorten: (fullUrl: string, customAlias?: string) => Promise<void>;
  deleteUrl: (alias: string) => Promise<void>;
  clearLastCreated: () => void;
}

export function useUrlShortener(): UseUrlShortenerReturn {
  const [urls, setUrls] = useState<UrlListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCreated, setLastCreated] = useState<ShortenUrlResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchPage = useCallback(async (page: number, size = pageSize) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listAll(page, size);
      setUrls(data.items);
      setCurrentPage(data.page);
      setPageSize(data.size);
      setTotalCount(data.totalCount);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load URLs.');
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchPage(0, pageSize);
  }, [fetchPage, pageSize]);

  const goToPage = useCallback(async (page: number) => {
    const nextPage = Math.max(page, 0);
    await fetchPage(nextPage, pageSize);
  }, [fetchPage, pageSize]);

  const previousPage = useCallback(async () => {
    if (currentPage <= 0) return;
    await goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const nextPage = useCallback(async () => {
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    if (currentPage >= totalPages - 1) return;
    await goToPage(currentPage + 1);
  }, [currentPage, goToPage, pageSize, totalCount]);

  const shorten = useCallback(async (fullUrl: string, customAlias?: string) => {
    setError(null);
    setLastCreated(null);
    try {
      const result = await api.shorten({ fullUrl, customAlias: customAlias || undefined });
      setLastCreated(result);
      await fetchPage(currentPage, pageSize);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to shorten URL.');
    }
  }, [currentPage, fetchPage, pageSize]);

  const deleteUrl = useCallback(async (alias: string) => {
    setError(null);
    try {
      await api.delete(alias);
      await fetchPage(currentPage, pageSize);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete URL.');
    }
  }, [currentPage, fetchPage, pageSize]);

  const clearLastCreated = useCallback(() => setLastCreated(null), []);

  const hasPreviousPage = currentPage > 0;
  const hasNextPage = currentPage < Math.max(0, Math.ceil(totalCount / pageSize) - 1);

  return {
    urls,
    loading,
    error,
    lastCreated,
    currentPage,
    pageSize,
    totalCount,
    hasPreviousPage,
    hasNextPage,
    goToPage,
    previousPage,
    nextPage,
    shorten,
    deleteUrl,
    clearLastCreated,
  };
}
