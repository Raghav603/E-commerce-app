import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

export function useWishlistViewModel() {
  // --- STATE ---
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // --- SELECTORS ---
  const likedItems = useSelector((state) => state.WishlistReducer || []);

  // --- DERIVED STATE ---
  const displayedItems = useMemo(() => {
    if (!searchQuery.trim()) return likedItems;
    const q = searchQuery.toLowerCase();
    return likedItems.filter(item =>
      (item.name ?? item.title ?? '').toLowerCase().includes(q)
    );
  }, [likedItems, searchQuery]);

  const isEmpty = likedItems.length === 0;
  const noResults = !isEmpty && displayedItems.length === 0;

  // --- HANDLERS ---
  const wishlistSearchToggle = useCallback(() => {
    setSearchVisible((prev) => {
      // If we are closing the search, clear the query
      if (prev) {
        setSearchQuery('');
      }
      return !prev;
    });
  }, []);

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  return {
    // Data
    displayedItems,
    searchVisible,
    searchQuery,
    isEmpty,
    noResults,

    // Handlers
    wishlistSearchToggle,
    handleSearchChange,
  };
}
