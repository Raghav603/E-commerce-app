import { useCallback, useEffect, useRef, useState } from 'react';
import { productService } from '../services/productService';

const LIMIT = 90; 

const normalise = (v) => {
  if (!v || (Array.isArray(v) && v.length === 0)) return [];
  return Array.isArray(v) ? v : [v];
};

export function useHomeViewModel(initialCategory = '') {
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError]             = useState(null);
  const [hasMore, setHasMore]         = useState(true);

  const [currentSort, setCurrentSort] = useState('Relevance');
  
  // ─── UNIFIED FILTERS STATE ───
  const [filters, setFilters] = useState({
    categories: normalise(initialCategory),
    gender: '',
    price: null,
    rating: null,
    discount: null,
  });

  const mountedRef    = useRef(true);
  const pageRef       = useRef(0);
  const isFetchingRef = useRef(false);
  const sortRef       = useRef('Relevance');
  const filtersRef    = useRef(filters);

  sortRef.current       = currentSort;
  filtersRef.current    = filters;

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const fetchPage = useCallback(async (isRefresh = false) => {
    if (isFetchingRef.current) return;
    if (!isRefresh && !hasMore) return;

    isFetchingRef.current = true;
    setError(null);

    const sort = sortRef.current;
    const f    = filtersRef.current; 

    try {
      if (isRefresh) {
        setRefreshing(true);
        pageRef.current = 0;
      } else {
        setLoadingMore(true);
      }

      let sortBy = '', order = '';
      if (sort === 'Price (High to Low)')      { sortBy = 'price';               order = 'desc'; }
      else if (sort === 'Price (Low to High)') { sortBy = 'price';               order = 'asc';  }
      else if (sort === 'Ratings')             { sortBy = 'rating';              order = 'desc'; }
      else if (sort === 'Discount')            { sortBy = 'discountPercentage';  order = 'desc'; }

      const apiCategory = f.categories.length === 1 ? f.categories[0] : '';
      const hasAdvancedFilter = !!(f.gender || f.price || f.rating || f.discount);

      const fetchLimit = hasAdvancedFilter ? 200 : LIMIT;
      const fetchSkip = hasAdvancedFilter ? 0 : pageRef.current;

      const mapped = await productService.fetchProducts({
        limit:      fetchLimit,
        skip:       fetchSkip,
        sortBy,
        order,
        category:   apiCategory,
      });

      if (!mountedRef.current) return;

      setProducts((prev) => {
        let combined = isRefresh 
            ? [...mapped] 
            : [...prev, ...mapped.filter((p) => !new Set(prev.map(x => x.id)).has(p.id))];

        // 1. Categories Filter
        if (f.categories.length > 1) {
          combined = combined.filter(p => f.categories.includes(p.category));
        }

        // 2. Gender Filter
        if (f.gender) {
          const g = f.gender.toLowerCase().trim();
          const isWomen = g.includes('woman') || g.includes('women') || g.includes('female');
          const isMen   = !isWomen && (g.includes('man') || g.includes('men') || g.includes('male'));
          const isBoy   = g.includes('boy');
          const isGirl  = g.includes('girl');

          combined = combined.filter(p => {
            const cat = (p.category || '').toLowerCase();
            if (isMen) return cat.includes('mens');
            if (isWomen) return cat.includes('womens') || cat === 'tops';
            if (isBoy) return cat.includes('boy') || cat.includes('boys');
            if (isGirl) return cat.includes('girl') || cat.includes('girls');
            return false;
          });
        }

        // 3. Price Filter
        if (f.price) {
          combined = combined.filter(p => {
            const priceVal = typeof p.price === 'string' ? parseFloat(p.price.replace(/[^0-9.]/g, '')) : (p.price || 0);
            return priceVal >= f.price.min && priceVal <= f.price.max;
          });
        }

        // 4. Rating Filter
        if (f.rating) {
          combined = combined.filter(p => (p.rating || 0) >= f.rating);
        }

        // 5. Discount Filter
        if (f.discount) {
          combined = combined.filter(p => {
            const disc = p.discountPercent ?? p.discountPercentage ?? 0;
            return disc >= f.discount;
          });
        }

        // 6. Local Sorting
        if (sortBy) {
          combined.sort((a, b) => {
            let valA = 0, valB = 0;
            if (sortBy === 'price') {
              valA = typeof a.price === 'string' ? parseFloat(a.price.replace(/[^0-9.]/g, '')) : (a.price || 0);
              valB = typeof b.price === 'string' ? parseFloat(b.price.replace(/[^0-9.]/g, '')) : (b.price || 0);
            } else if (sortBy === 'rating') {
              valA = a.rating || 0;
              valB = b.rating || 0;
            } else if (sortBy === 'discountPercentage') {
              valA = a.discountPercent ?? a.discountPercentage ?? 0;
              valB = b.discountPercent ?? b.discountPercentage ?? 0;
            }
            return order === 'desc' ? valB - valA : valA - valB;
          });
        }

        return combined;
      });

      pageRef.current = hasAdvancedFilter ? 200 : pageRef.current + LIMIT;
      setHasMore(hasAdvancedFilter ? false : (f.categories.length <= 1 ? mapped.length === LIMIT : false));

    } catch (err) {
      if (!mountedRef.current) return;
      setError(err?.message ?? String(err));
    } finally {
      if (!mountedRef.current) return;
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoading(true);
    setProducts([]);
    setHasMore(true);
    pageRef.current       = 0;
    isFetchingRef.current = false; 
    fetchPage(true);
  }, [currentSort, filters]); // 👈 Automatically refreshes list when any filter changes

  const refresh  = useCallback(() => fetchPage(true),  [fetchPage]);
  const loadMore = useCallback(() => fetchPage(false), [fetchPage]);

  const applySort = useCallback((option) => setCurrentSort(option), []);
  const applyCategories = useCallback((cats) => setFilters(prev => ({ ...prev, categories: cats })), []);
  const applyGender = useCallback((g) => setFilters(prev => ({ ...prev, gender: g })), []);
  const applyAllFilters = useCallback((newFilters) => setFilters(newFilters), []);

  return {
    products, loading, refreshing, loadingMore, error, hasMore,
    refresh, loadMore, applySort, currentSort,
    filters, applyCategories, applyGender, applyAllFilters // 👈 Export unified methods
  };
}