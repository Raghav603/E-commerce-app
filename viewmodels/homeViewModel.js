import { useCallback, useEffect, useRef, useState } from 'react';
import { productService } from '../services/productService';

const LIMIT = 10;

export function useHomeViewModel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Avoid stale calls after unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const getAPIData = useCallback(
    async (isRefresh = false) => {
      if (!isRefresh && !hasMore) return;

      if (!mountedRef.current) return;
      setError(null);

      try {
        if (isRefresh) setRefreshing(true);
        else if (page > 0) setLoadingMore(true);

        const skip = isRefresh ? 0 : page;
        const mappedProducts = await productService.fetchProducts({
          limit: LIMIT,
          skip,
        });

        if (!mountedRef.current) return;

        setProducts((prev) => (isRefresh ? mappedProducts : [...prev, ...mappedProducts]));
        setPage(isRefresh ? LIMIT : page + LIMIT);
        setHasMore(mappedProducts.length === LIMIT);

      } catch (err) {
        if (!mountedRef.current) return;
        setError(err?.message ?? String(err));
      } finally {
        if (!mountedRef.current) return;
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [hasMore, page]
  );

  useEffect(() => {
    // initial load
    getAPIData(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = useCallback(() => getAPIData(true), [getAPIData]);
  const loadMore = useCallback(() => getAPIData(false), [getAPIData]);

  return {
    products,
    loading,
    refreshing,
    loadingMore,
    error,
    hasMore,
    refresh,
    loadMore,
  };
}

