import { useState, useContext } from 'react';
import { Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
 
import { addToCart } from '../models/redux/cart/action';
import { addToWishlist, removeFromWishlist } from '../models/redux/wishlist/wishlistActions';
import { ThemeContext } from '../navigation/AppNavigator';

const { width } = Dimensions.get('window');

export function useProductDetailViewModel(product) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { resolvedTheme } = useContext(ThemeContext);

  // --- REDUX STATE ---
  const wishlistItems = useSelector(state => state.WishlistReducer || []);
  const cartItems = useSelector(state => state.Reducer || []);

  // --- LOCAL STATE ---
  const [activeImage, setActiveImage] = useState(0);

  // --- DERIVED STATE & CONSTANTS ---
  const productId = product?.id ?? product?.name;
  const isLiked = wishlistItems.some(x => (x?.id ?? x?.name) === productId);
  const cartCount = cartItems.length;

  const isDark = resolvedTheme === 'dark';
  const colors = {
    bg: isDark ? '#121212' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#1A1A1A',
    subText: isDark ? '#A9A9A9' : '#737373',
    border: isDark ? '#333333' : '#EAEAEC',
    primary: '#9C27B0',
    green: '#00A962',
    lightGreen: isDark ? '#0A2B1D' : '#E8F5E9',
    badge: '#E53935',
    card: isDark ? '#1C1C1E' : '#F9F9F9'
  };

  const rawPrice = typeof product.price === 'number' ? product.price : parseFloat(String(product.price).replace(/[^0-9.]/g, ''));
  const originalPrice = Math.round(rawPrice * 84);
  const discountPct = Math.round(product.discountPercentage || product.discountPercent || 0);
  const finalPrice = Math.round(originalPrice - (originalPrice * discountPct / 100));

  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail || product.image];

  // --- HANDLERS ---
  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const toggleWishlist = () => {
    if (isLiked) {
      dispatch(removeFromWishlist(productId));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigation.navigate('ReviewOrder');
  };

  const onImageScroll = (e) => {
    setActiveImage(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const goBack = () => navigation.goBack();
  const navigateTo = (screen) => navigation.navigate(screen);

  // --- RENDER HELPERS ---
  const getSpecValue = (spec) => {
      if (!spec) return null;
      if (typeof spec === 'object' && spec.width && spec.height && spec.depth) {
          return `${spec.width} x ${spec.height} x ${spec.depth} cm`;
      }
      if (typeof spec === 'number') { // For weight
          return `${spec} kg`;
      }
      return spec;
  };

  return {
    // Data for UI
    product,
    images,
    isLiked,
    cartCount,
    finalPrice,
    originalPrice,
    discountPct,
    activeImage,
    colors,

    // Handlers
    handleAddToCart,
    toggleWishlist,
    handleBuyNow,
    onImageScroll,
    goBack,
    navigateTo,
    getSpecValue,
  };
}