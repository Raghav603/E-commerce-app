import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from './redux/action';
import { addToWishlist, removeFromWishlist } from './redux/wishlistActions';

const Product = ({ item, theme }) => {
  const dispatch = useDispatch();
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
    <View style={[styles.card, { backgroundColor: colors.card }]}>

      {/* ── Image + badges ─────────────────────────────────── */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />

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
          <Text style={styles.likeIcon}>{isLiked ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      {/* ── Product info ────────────────────────────────────── */}
      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
          {item.name}
        </Text>

        {/* Rating row */}
        {rating !== null && (
          <View style={styles.ratingRow}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingStar}>★</Text>
              <Text style={styles.ratingValue}>{Number(rating).toFixed(1)}</Text>
            </View>
          </View>
        )}

        {/* Price row + add to cart */}
        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.price}>₹{currentPrice.toLocaleString('en-IN')}</Text>
            {originalPriceINR && originalPriceINR > currentPrice && (
              <Text style={[styles.originalPrice, { color: colors.subText }]}>
                ₹{originalPriceINR.toLocaleString('en-IN')}
              </Text>
            )}
          </View>

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
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  // ── Image ──────────────────────────────────────────────
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },

  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#E53935',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  likeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  likeIcon: {
    fontSize: 14,
  },

  // ── Info section ────────────────────────────────────────
  infoContainer: {
    padding: 10,
    paddingTop: 8,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 4,
  },

  // ── Rating ─────────────────────────────────────────────
  ratingRow: {
    marginBottom: 6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5DB075',
    alignSelf: 'flex-start',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingStar: {
    color: '#fff',
    fontSize: 10,
    marginRight: 2,
  },
  ratingValue: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },

  // ── Price + cart ────────────────────────────────────────
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: '#5DB075',
  },
  originalPrice: {
    fontSize: 11,
    textDecorationLine: 'line-through',
    marginTop: 1,
  },

  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#5DB075',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plus: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
  },

  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  count: {
    marginHorizontal: 8,
    fontWeight: '700',
    fontSize: 13,
  },
  counterText: {
    fontSize: 18,
    color: '#5DB075',
    fontWeight: '700',
  },
});

export default Product;