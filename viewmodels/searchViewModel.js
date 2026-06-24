import { useCallback, useEffect, useMemo, useState } from 'react';
import { categoryService } from '../services/categoryService';

export function useSearchViewModel() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let alive = true;

    const fetchCategories = async () => {
      try {
        const data = await categoryService.fetchCategories();
        if (!alive) return;
        setCategories(data);
      } catch (e) {
        // keep previous behavior: console error
        // eslint-disable-next-line no-console
        console.error('Error fetching categories:', e);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    fetchCategories();
    return () => {
      alive = false;
    };
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter((item) => {
      const itemName = item?.name || (typeof item === 'string' ? item.replace('-', ' ') : 'Category');
      return itemName.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [categories, searchQuery]);

  const onChangeQuery = useCallback((v) => setSearchQuery(v), []);

  return {
    loading,
    categories,
    filteredCategories,
    searchQuery,
    setSearchQuery: onChangeQuery,
  };
}

