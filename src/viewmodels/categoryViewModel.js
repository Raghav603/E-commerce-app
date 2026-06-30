import { useCallback, useEffect, useState } from 'react';
import { productService } from '../models/services/productService';

export function useCategoryViewModel() {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategorizedData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const products = await productService.fetchFakeStoreProducts();

      // Group the products by their category
      const groups = {};
      products.forEach((item) => {
        const cat = item.category || 'Other';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(item);
      });

      setGroupedProducts(groups);
    } catch (err) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCategorizedData();
  }, [fetchCategorizedData]);

  const refresh = useCallback(() => fetchCategorizedData(true), [fetchCategorizedData]);

  return {
    groupedProducts,
    loading,
    refreshing,
    error,
    refresh,
  };
}
