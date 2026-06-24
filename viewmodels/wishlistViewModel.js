import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

export function useWishlistViewModel() {
  const [searchVisible, setSearchVisible] = useState(false);
  const likedItems = useSelector((state) => state.WishlistReducer || []);

  const wishlistSearchToggle = useCallback(() => {
    setSearchVisible((prev) => !prev);
  }, []);

  return {
    likedItems,
    searchVisible,
    wishlistSearchToggle,
  };
}


