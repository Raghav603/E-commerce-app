import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { addToCart, removeFromCart, removeAllFromCart } from './redux/action';
import { addToWishlist, removeFromWishlist } from './redux/wishlistActions';

const Cart = ({ theme }) => {
  const cartItems = useSelector(state => state.Reducer);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Colors adapted for Light/Dark mode
  const colors = {
    light: { background: '#F2F2F2', text: '#1A1A1A', subText: '#737373', cardBg: '#FFFFFF', border: '#EAEAEC', green: '#00A962', purple: '#6A1B9A' },
    dark:  { background: '#121212', text: '#FFFFFF', subText: '#A9A9A9', cardBg: '#1C1C1E', border: '#333333', green: '#00D17A', purple: '#9C27B0' },
  };
  const c = theme === 'dark' ? colors.dark : colors.light;

  // Deduplicate items and calculate quantity
  const groupedItems = cartItems.reduce((acc, currentItem) => {
    const existing = acc.find(item => item.id === currentItem.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      acc.push({ ...currentItem, quantity: 1 });
    }
    return acc;
  }, []);

  // ─── HANDLERS FOR REDUX ───
  const handleIncreaseQuantity = (item) => {
    dispatch(addToCart(item));
  };
  
  const handleDecreaseQuantity = (item) => {
    const indexToRemove = cartItems.findIndex(cartItem => cartItem.id === item.id);
    if (indexToRemove !== -1) {
      dispatch(removeFromCart(item.id ?? item.name));
    }
  };
  
  const handleRemoveCompletely = (item) => {
    // Removes all quantities of this product in one go
    dispatch(removeAllFromCart(item.id ?? item.name));
  };

  const handleMoveToWishlist = (item) => {
    // 1. Add to wishlist
    dispatch(addToWishlist(item));
    // 2. Remove completely from cart
    // dispatch(removeFromWishlist(item.id ?? item.name));
  };

  // ─── PRICE CALCULATIONS ───
  let totalOriginalPrice = 0;
  let totalFinalPrice = 0;

  groupedItems.forEach(item => {
    const rawPrice = typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^0-9.]/g, ''));
    const originalINR = Math.round(rawPrice * 84);
    
    const discountPct = item.discountPercentage || item.discountPercent || 0;
    const finalINR = Math.round(originalINR - (originalINR * discountPct / 100));

    totalOriginalPrice += (originalINR * item.quantity);
    totalFinalPrice += (finalINR * item.quantity);
  });

  const totalDiscount = totalOriginalPrice - totalFinalPrice;
  const itemCount = cartItems.length;

  if (groupedItems.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: c.background }]}>
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={[styles.emptyText, { color: c.text }]}>Your cart is empty.</Text>
          <Text style={[styles.emptySubText, { color: c.subText }]}>Add items from the home screen to get started.</Text>
        </View>
      </View>
    );
  }

  const renderCartItem = ({ item }) => {
    const rawPrice = typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^0-9.]/g, ''));
    const originalPrice = Math.round(rawPrice * 84);
    const discountPct = Math.round(item.discountPercentage || item.discountPercent || 0);
    const finalPrice = Math.round(originalPrice - (originalPrice * discountPct / 100));

    return (
      <View style={[styles.card, { backgroundColor: c.cardBg, borderColor: c.border }]}>
        {/* TOP SECTION: Details */}
        <View style={styles.cardTop}>
          <View style={[styles.imageContainer, { borderColor: c.border }]}>
            <Image source={{ uri: item.thumbnail || item.images?.[0] || item.image }} style={styles.productImage} resizeMode="contain" />
          </View>
          
          <View style={styles.productDetails}>
            {/* Mall Badge */}
            <View style={[styles.mallBadge, { backgroundColor: c.purple }]}>
              <Text style={styles.mallBadgeText}>✓ Mall</Text>
            </View>

            <Text style={[styles.productTitle, { color: c.text }]} numberOfLines={2}>
              {item.title || item.name}
            </Text>
            
            {/* Price Row */}
            <View style={styles.priceRow}>
              <Text style={[styles.finalPrice, { color: c.text }]}>₹{finalPrice.toLocaleString('en-IN')}</Text>
              {discountPct > 0 && (
                <>
                  <Text style={[styles.originalPrice, { color: c.subText }]}>₹{originalPrice.toLocaleString('en-IN')}</Text>
                  <Text style={[styles.discountText, { color: c.green }]}>{discountPct}% Off</Text>
                </>
              )}
            </View>
            
            {/* Selectors */}
            <View style={styles.selectorsRow}>
              <View style={[styles.pill, { borderColor: c.border }]}>
                <Text style={[styles.pillText, { color: c.subText }]}>Size: Free Size</Text>
              </View>
              
              <View style={[styles.pill, styles.qtyPill, { borderColor: c.border }]}>
                <TouchableOpacity onPress={() => handleDecreaseQuantity(item)} style={styles.qtyBtn}>
                  <Text style={[styles.qtyBtnText, { color: c.text }]}>-</Text>
                </TouchableOpacity>
                <Text style={[styles.pillText, { color: c.text, marginHorizontal: 8, fontWeight: '600' }]}>Qty: {item.quantity}</Text>
                <TouchableOpacity onPress={() => handleIncreaseQuantity(item)} style={styles.qtyBtn}>
                  <Text style={[styles.qtyBtnText, { color: c.text }]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={[styles.returnPolicy, { color: c.subText }]}>No Returns-Only Exchange</Text>
          </View>
        </View>

        {/* BOTTOM SECTION: Actions */}
        <View style={[styles.cardBottom, { borderTopColor: c.border }]}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleMoveToWishlist(item)}>
            <Text style={[styles.actionIcon, { color: c.text }]}>❤️</Text>
            <Text style={[styles.actionText, { color: c.text }]}>Move to Wishlist</Text>
          </TouchableOpacity>
          <View style={[styles.verticalDivider, { backgroundColor: c.border }]} />
          <TouchableOpacity onPress={() => handleRemoveCompletely(item)} style={styles.actionBtn}>
            <Text style={[styles.actionIcon, { color: c.text }]}>✕</Text>
            <Text style={[styles.actionText, { color: c.text }]}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderFooter = () => (
    <View style={{ paddingBottom: 100 }}>
      {/* Standalone Wishlist Row - Navigates to Wishlist Page */}
      <TouchableOpacity 
        style={[styles.standaloneWishlist, { backgroundColor: c.cardBg, borderColor: c.border }]}
        onPress={() => navigation.navigate('Wishlist')}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.wishlistHeart, { color: c.text }]}>❤️</Text>
          <Text style={[styles.wishlistTitle, { color: c.text }]}>Wishlist</Text>
        </View>
        <Text style={{ color: c.subText, fontSize: 18 }}>›</Text>
      </TouchableOpacity>

      {/* Price Details Card */}
      <View style={[styles.priceDetailsCard, { backgroundColor: c.cardBg, borderColor: c.border }]}>
        <Text style={[styles.priceDetailsTitle, { color: c.text }]}>Price Details ({itemCount} Items)</Text>
        
        <View style={styles.priceRowBetween}>
          <Text style={[styles.priceLabel, { color: c.subText }]}>Product Price</Text>
          <Text style={[styles.priceValue, { color: c.text }]}>+ ₹{totalOriginalPrice.toLocaleString('en-IN')}</Text>
        </View>
        
        {totalDiscount > 0 && (
          <View style={styles.priceRowBetween}>
            <Text style={[styles.priceLabel, { color: c.subText }]}>Total Discounts</Text>
            <Text style={[styles.priceValue, { color: c.green }]}>- ₹{totalDiscount.toLocaleString('en-IN')}</Text>
          </View>
        )}
        
        <View style={[styles.orderTotalRow, { borderTopColor: c.border }]}>
          <Text style={[styles.orderTotalLabel, { color: c.text }]}>Order Total</Text>
          <Text style={[styles.orderTotalValue, { color: c.text }]}>₹{totalFinalPrice.toLocaleString('en-IN')}</Text>
        </View>

        {totalDiscount > 0 && (
          <View style={[styles.yayBanner, { backgroundColor: theme === 'dark' ? '#0A2B1D' : '#E8F5E9' }]}>
            <Text style={[styles.yayText, { color: c.green }]}>% Yay! Your total discount is ₹{totalDiscount.toLocaleString('en-IN')}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <FlatList
        data={groupedItems}
        keyExtractor={(item) => String(item.id ?? item.name)}
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered:  { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  emptyIcon: { fontSize: 52, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
  emptySubText: { fontSize: 13, textAlign: 'center', lineHeight: 18 },

  listContent: { paddingBottom: 20 },

  // ── CART ITEM CARD ──
  card: {
    marginBottom: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  cardTop: {
    flexDirection: 'row',
    padding: 16,
  },
  imageContainer: {
    width: 90,
    height: 110,
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productDetails: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  mallBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  mallBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  productTitle: { fontSize: 14, fontWeight: '500', marginBottom: 8, lineHeight: 20 },
  
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  finalPrice: { fontSize: 18, fontWeight: '700', marginRight: 6 },
  originalPrice: { fontSize: 13, textDecorationLine: 'line-through', marginRight: 6 },
  discountText: { fontSize: 12, fontWeight: '700' },

  selectorsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  pill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, marginRight: 8 },
  qtyPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4 },
  pillText: { fontSize: 12 },
  qtyBtn: { paddingHorizontal: 8, paddingVertical: 2 },
  qtyBtnText: { fontSize: 16, fontWeight: 'bold' },
  
  returnPolicy: { fontSize: 11, fontStyle: 'italic', marginTop: 4 },

  cardBottom: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  actionIcon: { fontSize: 16, marginRight: 8 },
  actionText: { fontSize: 14, fontWeight: '500' },
  verticalDivider: { width: 1, height: '100%' },

  // ── WISHLIST ROW ──
  standaloneWishlist: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  wishlistHeart: { fontSize: 20, marginRight: 12 },
  wishlistTitle: { fontSize: 15, fontWeight: '600' },

  // ── PRICE DETAILS CARD ──
  priceDetailsCard: {
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  priceDetailsTitle: { fontSize: 16, fontWeight: '600', marginBottom: 16 },
  priceRowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  priceLabel: { fontSize: 14 },
  priceValue: { fontSize: 14, fontWeight: '500' },
  
  orderTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    marginBottom: 16,
  },
  orderTotalLabel: { fontSize: 16, fontWeight: '700' },
  orderTotalValue: { fontSize: 16, fontWeight: '700' },

  yayBanner: {
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yayText: { fontSize: 13, fontWeight: '700' }
});

export default Cart;