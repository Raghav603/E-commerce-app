import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native'; // 👈 1. Imported useNavigation
import { addToCart, removeFromCart } from '../../models/redux/cart/action';
import { addToWishlist, removeFromWishlist } from '../../models/redux/wishlist/wishlistActions';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Product = ({ item, theme }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation(); // 👈 2. Initialized navigation

  const cartItems     = useSelector(state => state.Reducer);
  const wishlistItems = useSelector(state => state.WishlistReducer || []);

  const isDark = theme === 'dark';
  const colors = {
    card:        isDark ? '#1C1C1E' : '#FFFFFF',
    text:        isDark ? '#F2F2F7' : '#1A1A1A',
    subText:     isDark ? '#8E8E93' : '#888',
    counterBg:   isDark ? '#2C2C2E' : '#EEF8F0',
    tagBg:       isDark ? '#2C2C2E' : '#F2F2F7',
    shadow:      isDark ? '#000'    : '#000',
  };

  const productId = item?.id ?? item?.name;
  const itemCount = cartItems.filter(x => (x?.id ?? x?.name) === productId).length;
  const isLiked   = wishlistItems.some(x => (x?.id ?? x?.name) === productId);

  const toggleLike = () =>
    isLiked ? dispatch(removeFromWishlist(productId)) : dispatch(addToWishlist(item));

  // Parse raw price — productService stores as number (INR) or legacy "$X" string
  const rawPrice = typeof item.price === 'number'
    ? item.price
    : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) * 84;

  const currentPrice = Math.round(rawPrice);

  // Derive discount — use discountPercent from API first, then calculate from originalPrice
  const originalPrice = item.originalPrice ?? item.mrp ?? item.comparePrice ?? null;
  const originalPriceINR = originalPrice ? Math.round(originalPrice * 84) : null;

  const discount = item.discountPercent
    ? Math.round(item.discountPercent)
    : originalPriceINR
    ? Math.round(((originalPriceINR - currentPrice) / originalPriceINR) * 100)
    : null;

  // Rating — use item.rating if present
  const rating = item.rating ?? null;

  return (
    // 👇 3. Changed View to TouchableOpacity and added onPress navigation
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.card }]}
      activeOpacity={0.95}
      onPress={() => navigation.navigate('ProductDetailScreen', { product: item })}
    >

      {/* ── Image + badges ─────────────────────────────────── */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image || item.thumbnail }} style={styles.image} />

        {/* Discount badge */}
        {discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discount}% OFF</Text>
          </View>
        )}

        {/* Wishlist button */}
        <TouchableOpacity
          style={styles.likeBtn}
          onPress={toggleLike}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.likeIcon}>{isLiked ? '❤️' : '♡'}</Text>
        </TouchableOpacity>
      </View>

      {/* ── Product info ────────────────────────────────────── */}
      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
          {item.name || item.title}
        </Text>

        {/* Rating row */}
        {rating !== null && (
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={11} color="#5DB075" style={{ marginRight: 3 }} />
            <Text style={[styles.ratingValueInline, { color: colors.text }]}>{Number(rating).toFixed(1)}</Text>
          </View>
        )}

        {/* Price */}
        <Text style={styles.price}>₹{currentPrice.toLocaleString('en-IN')}</Text>
        {originalPriceINR && originalPriceINR > currentPrice && (
          <Text style={[styles.originalPrice, { color: colors.subText }]}>
            ₹{originalPriceINR.toLocaleString('en-IN')}
          </Text>
        )}

        {/* Qty / Add button row */}
        <View style={styles.bottomRow}>
          {itemCount > 0 ? (
            <View style={[styles.counter, { backgroundColor: colors.counterBg }]}>
              <TouchableOpacity
                onPress={() => dispatch(removeFromCart(item.id ?? item.name))}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <Text style={styles.counterText}>−</Text>
              </TouchableOpacity>
              <Text style={[styles.count, { color: colors.text }]}>{itemCount}</Text>
              <TouchableOpacity
                onPress={() => dispatch(addToCart(item))}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <Text style={styles.counterText}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => dispatch(addToCart(item))}
              activeOpacity={0.8}
            >
              <Text style={styles.plus}>+</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'visible',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },

  // ── Image ──────────────────────────────────────────────
  imageContainer: {
    position: 'relative',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    backgroundColor: '#fff',
  },

  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#E53935',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },

  likeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  likeIcon: {
    fontSize: 14,
  },

  // ── Info section ────────────────────────────────────────
  infoContainer: {
    padding: 12,
    paddingTop: 10,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 6,
  },

  // ── Rating ─────────────────────────────────────────────
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#E8F5E9',
    alignSelf: 'flex-start',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingValueInline: {
    fontSize: 11,
    fontWeight: '700',
  },

  // ── Price + cart ────────────────────────────────────────
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: -28,
  },
  price: {
    fontSize: 17,
    fontWeight: '800',
    color: '#5DB075',
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    marginTop: 1,
    marginBottom: 8,
  },

  addBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#5DB075',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plus: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },

  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  count: {
    marginHorizontal: 10,
    fontWeight: '700',
    fontSize: 13,
  },
  counterText: {
    fontSize: 16,
    color: '#5DB075',
    fontWeight: '700',
  },
});

export default Product;