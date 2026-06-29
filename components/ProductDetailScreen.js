import React, { useContext, useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, 
  FlatList, Dimensions 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux'; 
import { ThemeContext } from '../navigation/AppNavigator'; 

import { addToCart } from '../components/redux/action';
import { addToWishlist, removeFromWishlist } from '../components/redux/wishlistActions';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const dispatch = useDispatch();
  const { resolvedTheme } = useContext(ThemeContext);

  // ─── REDUX STATE ───
  const wishlistItems = useSelector(state => state.WishlistReducer || []);
  const cartItems = useSelector(state => state.Reducer || []); // 👈 Get cart items

  const productId = product?.id ?? product?.name;
  const isLiked = wishlistItems.some(x => (x?.id ?? x?.name) === productId);
  
  // 👈 Calculate total cart items for the badge
  const cartCount = cartItems.length; 

  const isDark = resolvedTheme === 'dark';
  const c = {
    bg: isDark ? '#121212' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#1A1A1A',
    subText: isDark ? '#A9A9A9' : '#737373',
    border: isDark ? '#333333' : '#EAEAEC',
    primary: '#9C27B0', 
    green: '#00A962',
    lightGreen: isDark ? '#0A2B1D' : '#E8F5E9',
    badge: '#E53935', // Red color for the badge
  };

  const [activeImage, setActiveImage] = useState(0);

  const rawPrice = typeof product.price === 'number' ? product.price : parseFloat(String(product.price).replace(/[^0-9.]/g, ''));
  const originalPrice = Math.round(rawPrice * 84);
  const discountPct = Math.round(product.discountPercentage || product.discountPercent || 0);
  const finalPrice = Math.round(originalPrice - (originalPrice * discountPct / 100));

  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail || product.image];

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

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      
      {/* ─── HEADER ─── */}
      <View style={[styles.header, { backgroundColor: c.bg }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Text style={[styles.iconText, { color: c.text }]}>❮</Text>
        </TouchableOpacity>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Search')}>
            <Text style={[styles.iconText, { color: c.text }]}>🔍</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Wishlist')}>
            <Text style={[styles.iconText, { color: c.text }]}>❤️</Text>
          </TouchableOpacity>
          
          {/* 👇 Updated Cart Icon with Badge */}
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Cart')}>
            <Text style={[styles.iconText, { color: c.text }]}>🛒</Text>
            {cartCount > 0 && (
              <View style={[styles.badgeContainer, { backgroundColor: c.badge }]}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* ─── IMAGE CAROUSEL ─── */}
        <View style={styles.carouselContainer}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              setActiveImage(Math.round(e.nativeEvent.contentOffset.x / width));
            }}
            keyExtractor={(item, index) => String(index)}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.mainImage} resizeMode="contain" />
            )}
          />
          <TouchableOpacity style={[styles.moreLikeThisBtn, { borderColor: c.border, backgroundColor: c.bg }]}>
            <Text style={[styles.moreLikeThisText, { color: c.text }]}>⊞ More Like This</Text>
          </TouchableOpacity>
          
          <View style={styles.pagination}>
            {images.map((_, i) => (
              <View key={i} style={[styles.dot, { backgroundColor: i === activeImage ? c.primary : c.border }]} />
            ))}
          </View>
        </View>

        {/* ─── PRODUCT DETAILS ─── */}
        <View style={styles.detailsContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.productTitle, { color: c.text }]} numberOfLines={2}>
              <Text style={{ fontWeight: 'bold' }}>{product.brand ? `${product.brand.toUpperCase()} ` : ''}</Text>
              {product.title || product.name}
            </Text>
            
            <View style={styles.actionIcons}>
              <TouchableOpacity style={styles.actionBtn} onPress={toggleWishlist}>
                <Text style={styles.actionIconText}>{isLiked ? '❤️' : '🤍'}</Text>
                <Text style={[styles.actionLabel, { color: c.text }]}>Wishlist</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={[styles.actionIconText, { color: c.text }]}>➦</Text>
                <Text style={[styles.actionLabel, { color: c.text }]}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Pricing */}
          <View style={styles.priceRow}>
            <Text style={[styles.finalPrice, { color: c.text }]}>₹{finalPrice.toLocaleString('en-IN')}</Text>
            {discountPct > 0 && (
              <>
                <Text style={[styles.originalPrice, { color: c.subText }]}>₹{originalPrice.toLocaleString('en-IN')}</Text>
                <Text style={[styles.discountText, { color: c.subText }]}>{discountPct}% off</Text>
                <Text style={styles.infoIcon}>ⓘ</Text>
              </>
            )}
          </View>

          {/* Offer Badges */}
          {discountPct > 0 && (
            <View style={styles.badgesRow}>
              <View style={[styles.discountBadge, { backgroundColor: c.green }]}>
                <Text style={styles.discountBadgeText}>Discount Applied ✓</Text>
              </View>
            </View>
          )}
          
          <Text style={[styles.specialOffer, { color: c.green }]}>
            ₹{Math.round(finalPrice * 0.9).toLocaleString('en-IN')} with 1 Special Offer ›
          </Text>

          {/* Ratings */}
          <View style={styles.ratingRow}>
            <View style={[styles.ratingBadge, { backgroundColor: c.green }]}>
              <Text style={styles.ratingText}>{product.rating || '4.0'} ★</Text>
            </View>
            <Text style={[styles.reviewCount, { color: c.subText }]}>
              ({product.reviews?.length || Math.floor(Math.random() * 1000) + 100} reviews)
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ─── BOTTOM FIXED BAR ─── */}
      <View style={[styles.bottomBar, { backgroundColor: c.bg, borderTopColor: c.border }]}>
        <TouchableOpacity style={[styles.bottomBtn, styles.cartBtn, { borderColor: c.primary }]} onPress={handleAddToCart}>
          <Text style={[styles.cartBtnText, { color: c.primary }]}>🛒 Add to Cart</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.bottomBtn, styles.buyBtn, { backgroundColor: c.primary }]} 
          onPress={() => {
          handleAddToCart();
          navigation.navigate('ReviewOrder'); // 👈 Redirect here
           }}
        >
          <Text style={styles.buyBtnText}>▶ Buy Now</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 16, paddingVertical: 12, elevation: 2, zIndex: 10
  },
  headerRight: { flexDirection: 'row' },
  iconBtn: { padding: 8, marginLeft: 8, position: 'relative' }, // 👈 Added relative positioning for the badge
  iconText: { fontSize: 20, fontWeight: '600' },
  
  // 👇 New Badge Styles
  badgeContainer: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFF', // Creates a nice cutout effect against the icon
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

  carouselContainer: { width, height: 400, backgroundColor: '#FFF', position: 'relative' },
  mainImage: { width, height: 400 },
  moreLikeThisBtn: { 
    position: 'absolute', bottom: 30, right: 16, 
    borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 
  },
  moreLikeThisText: { fontSize: 12, fontWeight: '600' },
  pagination: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, marginHorizontal: 4 },

  section: { padding: 16, borderBottomWidth: 4, borderBottomColor: '#F0F0F0' },
  sectionTitle: { fontSize: 13, fontWeight: '600', marginBottom: 12 },
  thumbnailRow: { flexDirection: 'row' },
  thumbnail: { width: 60, height: 70, borderWidth: 2, borderRadius: 6, marginRight: 12 },

  detailsContainer: { padding: 16 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  productTitle: { flex: 1, fontSize: 16, color: '#555', lineHeight: 22, marginRight: 16 },
  actionIcons: { flexDirection: 'row', alignItems: 'center' },
  actionBtn: { alignItems: 'center', marginLeft: 16 },
  actionIconText: { fontSize: 22, marginBottom: 2 },
  actionLabel: { fontSize: 11 },

  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, marginBottom: 8 },
  finalPrice: { fontSize: 24, fontWeight: '800', marginRight: 8 },
  originalPrice: { fontSize: 16, textDecorationLine: 'line-through', marginRight: 8 },
  discountText: { fontSize: 14, fontWeight: '600', marginRight: 6 },
  infoIcon: { fontSize: 14, color: '#999' },

  badgesRow: { flexDirection: 'row', marginBottom: 8 },
  discountBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  discountBadgeText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  
  specialOffer: { fontSize: 14, fontWeight: '600', marginBottom: 12 },

  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  ratingText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  reviewCount: { fontSize: 12, marginLeft: 8 },

  bottomBar: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    flexDirection: 'row', padding: 12, borderTopWidth: 1, elevation: 10 
  },
  bottomBtn: { flex: 1, paddingVertical: 14, borderRadius: 4, alignItems: 'center', justifyContent: 'center', marginHorizontal: 4 },
  cartBtn: { borderWidth: 1 },
  cartBtnText: { fontSize: 15, fontWeight: '700' },
  buyBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});