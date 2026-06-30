import React, { useContext, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Linking, ActivityIndicator, Image
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../navigation/AppNavigator';

export default function PaymentScreen() {
  const navigation        = useNavigation();
  const { resolvedTheme } = useContext(ThemeContext);
  const cartItems         = useSelector(state => state.Reducer);
  const isDark            = resolvedTheme === 'dark';

  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [processing,     setProcessing]     = useState(false);

  const c = {
    bg:      isDark ? '#0A0A0A' : '#F7F8FA',
    card:    isDark ? '#1C1C1E' : '#FFFFFF',
    text:    isDark ? '#F2F2F7' : '#1A1A1A',
    sub:     isDark ? '#8E8E93' : '#777',
    border:  isDark ? '#2C2C2E' : '#E5E5E5',
    green:   '#5DB075',
    purple:  '#6A1B9A',
  };

  // ── Cart calculations ───────────────────────────────────────────────────────
  const groupedItems = cartItems.reduce((acc, cur) => {
    const ex = acc.find(x => x.id === cur.id);
    ex ? ex.quantity++ : acc.push({ ...cur, quantity: 1 });
    return acc;
  }, []);

  const getPrice = item =>
    typeof item.price === 'number'
      ? item.price
      : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) * 84;

  let subtotal = 0, discount = 0;
  groupedItems.forEach(item => {
    const raw  = Math.round(getPrice(item));
    const disc = Math.round(raw * (item.discountPercent ?? item.discountPercentage ?? 0) / 100);
    subtotal += raw * item.quantity;
    discount += disc * item.quantity;
  });
  const orderTotal = subtotal - discount;

  // ── Pay via Native OS UPI Chooser ───────────────────────────────────────────
  const handleUPIPay = async () => {
    const genericUpiUrl =
      `upi://pay?pa=merchant@upi` +
      `&pn=MyShopApp` +
      `&am=${orderTotal}` +
      `&cu=INR` +
      `&tn=Order+Payment`;

    setProcessing(true);
    
    try {
      // 👈 THE FIX: Skip the `canOpenURL` check completely. 
      // Just force the OS to try opening it.
      await Linking.openURL(genericUpiUrl);
        
      setTimeout(() => {
        setProcessing(false);
        Alert.alert(
          '✅ Payment Initiated',
          'Complete the payment in your UPI app.\nYour order will be confirmed once payment is received.',
          [{ text: 'OK', onPress: () => navigation.navigate('HomeTabs') }],
        );
      }, 1200);

    } catch (e) {
      // If they genuinely don't have a UPI app, openURL throws an error and lands here
      setProcessing(false);
      Alert.alert(
        'No UPI App Found',
        'We could not find any UPI apps on your device. Please install Google Pay, PhonePe, Paytm, or BHIM and try again.',
      );
    }
  };

  const handleCOD = () =>
    Alert.alert(
      'Confirm Order',
      `Place order for ₹${orderTotal.toLocaleString('en-IN')} with Cash on Delivery?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () =>
            Alert.alert('🎉 Order Placed!', 'Your order has been placed successfully.', [
              { text: 'OK', onPress: () => navigation.navigate('HomeTabs') },
            ])
        },
      ],
    );

  const handlePay = () => {
    if (selectedMethod === 'cod') return handleCOD();
    if (selectedMethod === 'upi') return handleUPIPay();
    Alert.alert('Coming Soon', 'This payment method will be available soon.');
  };

  // ── Render helpers ──────────────────────────────────────────────────────────
  const RadioRow = ({ id, label, emoji, subtitle }) => (
    <TouchableOpacity style={styles.methodRow} onPress={() => setSelectedMethod(id)}>
      <View style={[styles.radio, { borderColor: selectedMethod === id ? c.green : c.sub }]}>
        {selectedMethod === id && <View style={[styles.radioDot, { backgroundColor: c.green }]} />}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.methodLabel, { color: c.text }]}>{label}</Text>
        {subtitle && <Text style={[styles.methodSub, { color: c.sub }]}>{subtitle}</Text>}
      </View>
      {emoji ? <Text style={styles.methodEmoji}>{emoji}</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: c.card, borderBottomColor: c.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={[styles.backIcon, { color: c.text }]}>❮</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: c.text }]}>PAYMENT</Text>
        <View style={[styles.stepBadge, { borderColor: c.border }]}>
          <Text style={[styles.stepText, { color: c.sub }]}>STEP 3/3</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>

        {/* Order summary */}
        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>
            Order Summary ({groupedItems.length} item{groupedItems.length !== 1 ? 's' : ''})
          </Text>
          {groupedItems.map(item => {
            const price = Math.round(getPrice(item));
            return (
              <View key={String(item.id)} style={[styles.orderItem, { borderTopColor: c.border }]}>
                <Image source={{ uri: item.thumbnail || item.image }} style={styles.orderImg} />
                <View style={styles.orderInfo}>
                  <Text style={[styles.orderName, { color: c.text }]} numberOfLines={2}>
                    {item.title || item.name}
                  </Text>
                  <Text style={[styles.orderQty, { color: c.sub }]}>Qty: {item.quantity}</Text>
                  <Text style={[styles.orderPrice, { color: c.green }]}>
                    ₹{(price * item.quantity).toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Price breakdown */}
        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>
            Price Details ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})
          </Text>
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: c.sub }]}>Product Price</Text>
            <Text style={[styles.priceVal, { color: c.text }]}>+ ₹{subtotal.toLocaleString('en-IN')}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: c.border }]} />
          {discount > 0 && (
            <>
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, { color: c.green }]}>Total Discounts</Text>
                <Text style={[styles.priceVal, { color: c.green }]}>− ₹{discount.toLocaleString('en-IN')}</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: c.border }]} />
            </>
          )}
          <View style={styles.priceRow}>
            <Text style={[styles.totalLabel, { color: c.text }]}>Order Total</Text>
            <Text style={[styles.totalVal, { color: c.text }]}>₹{orderTotal.toLocaleString('en-IN')}</Text>
          </View>
          {discount > 0 && (
            <View style={[styles.savingsBanner, { backgroundColor: isDark ? '#0A2B1D' : '#E8F5E9' }]}>
              <Text style={[styles.savingsText, { color: c.green }]}>
                🎉 Yay! Your total discount is ₹{discount.toLocaleString('en-IN')}
              </Text>
            </View>
          )}
        </View>

        {/* Payment methods */}
        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>Payment Method</Text>

          {/* UPI */}
          <RadioRow 
            id="upi" 
            label="UPI Apps" 
            subtitle="GPay, PhonePe, Paytm, BHIM, etc."
            emoji="📱" 
          />
          <View style={[styles.divider, { backgroundColor: c.border, marginVertical: 4 }]} />

          {/* Card */}
          <RadioRow id="card" label="Credit / Debit Card" emoji="💳" />
          <View style={[styles.divider, { backgroundColor: c.border, marginVertical: 4 }]} />

          {/* Net Banking */}
          <RadioRow id="netbanking" label="Net Banking" emoji="🏦" />
          <View style={[styles.divider, { backgroundColor: c.border, marginVertical: 4 }]} />

          {/* COD */}
          <RadioRow id="cod" label="Cash on Delivery" emoji="💵" />
        </View>

      </ScrollView>

      {/* Sticky pay button */}
      <View style={[styles.payBar, { backgroundColor: c.card, borderTopColor: c.border }]}>
        <View>
          <Text style={[styles.payTotal, { color: c.text }]}>₹{orderTotal.toLocaleString('en-IN')}</Text>
          {discount > 0 && (
            <Text style={[styles.paySaved, { color: c.green }]}>Save ₹{discount.toLocaleString('en-IN')}</Text>
          )}
        </View>
        <TouchableOpacity
          style={[styles.payBtn, { backgroundColor: c.green }, processing && { opacity: 0.65 }]}
          onPress={handlePay}
          disabled={processing}
          activeOpacity={0.85}
        >
          {processing
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.payBtnText}>
                {selectedMethod === 'cod'
                  ? 'Place Order'
                  : `Pay ₹${orderTotal.toLocaleString('en-IN')}`}
              </Text>
          }
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backBtn:     { marginRight: 12 },
  backIcon:    { fontSize: 24, fontWeight: '600' },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  stepBadge:   { borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  stepText:    { fontSize: 11, fontWeight: '600' },

  // Cards
  card: {
    marginHorizontal: 12, marginTop: 12,
    borderRadius: 12, borderWidth: 1,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 12 },

  // Order items
  orderItem:  { flexDirection: 'row', paddingTop: 12, borderTopWidth: 1 },
  orderImg:   { width: 70, height: 70, borderRadius: 8, marginRight: 12, backgroundColor: '#eee' },
  orderInfo:  { flex: 1 },
  orderName:  { fontSize: 13, fontWeight: '500', lineHeight: 18, marginBottom: 4 },
  orderQty:   { fontSize: 12, marginBottom: 2 },
  orderPrice: { fontSize: 14, fontWeight: '800' },

  // Price
  priceRow:    { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  priceLabel:  { fontSize: 14 },
  priceVal:    { fontSize: 14, fontWeight: '600' },
  divider:     { height: 1, marginVertical: 2 },
  totalLabel:  { fontSize: 16, fontWeight: '700' },
  totalVal:    { fontSize: 18, fontWeight: '800' },
  savingsBanner: { marginTop: 10, borderRadius: 8, padding: 10 },
  savingsText:   { fontSize: 13, fontWeight: '600', textAlign: 'center' },

  // Methods
  methodRow:   { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  radio:       { width: 20, height: 20, borderRadius: 10, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  radioDot:    { width: 10, height: 10, borderRadius: 5 },
  methodLabel: { fontSize: 15, fontWeight: '600' },
  methodSub:   { fontSize: 12, marginTop: 2 },
  methodEmoji: { fontSize: 22 },

  // Pay bar
  payBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    borderTopWidth: 1, elevation: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.08, shadowRadius: 6,
  },
  payTotal:   { fontSize: 20, fontWeight: '800' },
  paySaved:   { fontSize: 11, fontWeight: '600', marginTop: 2 },
  payBtn:     { paddingHorizontal: 28, paddingVertical: 14, borderRadius: 10 },
  payBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});