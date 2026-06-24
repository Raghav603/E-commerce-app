import { ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from './wishlistConstants';

export const addToWishlist = item => ({
  type: ADD_TO_WISHLIST,
  data: item,
});

export const removeFromWishlist = itemKey => ({
  type: REMOVE_FROM_WISHLIST,
  data: itemKey,
});

