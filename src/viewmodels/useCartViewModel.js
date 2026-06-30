import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { addToCart, removeFromCart, removeAllFromCart } from '../models/redux/cart/action';
import { addToWishlist } from '../models/redux/wishlist/wishlistActions';

export function useCartViewModel() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // --- SELECTORS ---
  const cartItems = useSelector(state => state.Reducer || []);

  // --- DERIVED STATE (MEMOIZED) ---

  // Group items, count quantities, and pre-calculate prices for each item
  const groupedItems = useMemo(() => {
    const reduced = cartItems.reduce((acc, currentItem) => {
      const existing = acc.find(item => item.id === currentItem.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        acc.push({ ...currentItem, quantity: 1 });
      }
      return acc;
    }, []);

    // Now map to add calculated prices
    return reduced.map(item => {
      const rawPrice = typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^0-9.]/g, ''));
      const originalPrice = Math.round(rawPrice * 84);
      const discountPct = Math.round(item.discountPercentage || item.discountPercent || 0);
      const finalPrice = Math.round(originalPrice - (originalPrice * discountPct / 100));
      return { ...item, originalPrice, finalPrice, discountPct };
    });
  }, [cartItems]);

  // Calculate total prices from the already processed groupedItems
  const { totalOriginalPrice, totalFinalPrice, totalDiscount } = useMemo(() => {
    let totalOriginal = 0;
    let totalFinal = 0;

    groupedItems.forEach(item => {
      totalOriginal += (item.originalPrice * item.quantity);
      totalFinal += (item.finalPrice * item.quantity);
    });

    return {
      totalOriginalPrice: totalOriginal,
      totalFinalPrice: totalFinal,
      totalDiscount: totalOriginal - totalFinal,
    };
  }, [groupedItems]);

  const itemCount = cartItems.length;
  const isEmpty = groupedItems.length === 0;

  // --- HANDLERS ---
  const handleIncreaseQuantity = (item) => {
    dispatch(addToCart(item));
  };

  const handleDecreaseQuantity = (item) => {
    dispatch(removeFromCart(item.id ?? item.name));
  };

  const handleRemoveCompletely = (item) => {
    dispatch(removeAllFromCart(item.id ?? item.name));
  };

  const handleMoveToWishlist = (item) => {
    dispatch(addToWishlist(item));
  };

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  return {
    // Data for UI
    groupedItems,
    totalOriginalPrice,
    totalFinalPrice,
    totalDiscount,
    itemCount,
    isEmpty,

    // Handlers
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleRemoveCompletely,
    handleMoveToWishlist,
    navigateTo,
  };
}