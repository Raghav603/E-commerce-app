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

  const [currentSort, setCurrentSort]             = useState('Relevance');
  const [currentCategories, setCurrentCategories] = useState(normalise(initialCategory));
  const [currentGender, setCurrentGender]         = useState('');

  const mountedRef    = useRef(true);
  const pageRef       = useRef(0);
  const isFetchingRef = useRef(false);
  const sortRef       = useRef('Relevance');
  const categoriesRef = useRef(normalise(initialCategory)); 
  const genderRef     = useRef('');

  sortRef.current       = currentSort;
  categoriesRef.current = currentCategories;
  genderRef.current     = currentGender;

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const fetchPage = useCallback(async (isRefresh = false) => {
    if (isFetchingRef.current) return;
    if (!isRefresh && !hasMore) return;

    isFetchingRef.current = true;
    setError(null);

    const sort       = sortRef.current;
    const categories = categoriesRef.current;
    const gender     = genderRef.current; 

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

      const apiCategory = categories.length === 1 ? categories[0] : '';

      // ─── 1. SMART GENDER FETCH OVERRIDE ────────────────────────────────────
      const g = (gender || '').toLowerCase();
      const isMen = g === 'man' || g === 'men' || g === 'male';
      const isWomen = g === 'woman' || g === 'women' || g === 'female';
      const isBoy = g === 'boy';
      const isGirl = g === 'girl';
      const hasGenderFilter = isMen || isWomen || isBoy || isGirl;

      // If a gender is selected, bypass the standard pagination and fetch the entire catalog 
      // (limit 200) instantly. This pulls items buried deep at #80+ straight to the front.
      const fetchLimit = hasGenderFilter ? 200 : LIMIT;
      const fetchSkip = hasGenderFilter ? 0 : pageRef.current;

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

        // ─── LOCAL CATEGORY FILTER ───
        if (categories.length > 1) {
          combined = combined.filter(p => categories.includes(p.category));
        }

        // ─── LOCAL GENDER FILTER ───
        if (hasGenderFilter) {
          combined = combined.filter(p => {
            const cat = (p.category || '').toLowerCase();
            if (isMen) return cat.includes('mens');
            if (isWomen) return cat.includes('womens') || cat === 'tops';
            if (isBoy) return cat.includes('boy') || cat.includes('boys');
            if (isGirl) return cat.includes('girl') || cat.includes('girls');
            return true;
          });
        }

        // ─── GUARANTEED LOCAL SORTING ───
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

      // ─── 2. ADJUST PAGINATION LOGIC ──────────────────────────────────────
      pageRef.current = hasGenderFilter ? 200 : pageRef.current + LIMIT;
      
      // If we just fetched all 200 items for the gender filter, there's no more data to load.
      setHasMore(hasGenderFilter ? false : (categories.length <= 1 ? mapped.length === LIMIT : false));

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
  }, [currentSort, currentCategories, currentGender]); 

  const refresh  = useCallback(() => fetchPage(true),  [fetchPage]);
  const loadMore = useCallback(() => fetchPage(false), [fetchPage]);

  const applySort = useCallback((option) => {
    if (sortRef.current === option) return;
    setCurrentSort(option);
  }, []);

  const applyCategories = useCallback((slugs) => {
    const next = normalise(slugs);
    const curr = categoriesRef.current;
    const same = next.length === curr.length && next.every((s) => curr.includes(s));
    if (same) return;
    setCurrentCategories(next);
  }, []);

  const applyCategory = useCallback(
    (slug) => applyCategories(slug ? [slug] : []),
    [applyCategories],
  );

  const applyGender = useCallback((g) => {
    if (genderRef.current === g) return;
    setCurrentGender(g);
  }, []);

  return {
    products, loading, refreshing, loadingMore, error, hasMore,
    refresh, loadMore,
    currentSort,       applySort,
    currentCategories, applyCategories,
    currentCategory:   currentCategories[0] ?? '',
    applyCategory,
    currentGender,     applyGender 
  };
}