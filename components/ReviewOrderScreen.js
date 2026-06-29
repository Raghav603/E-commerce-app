import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Cart from './Cart'; 
import { ThemeContext } from '../navigation/AppNavigator';

export default function ReviewOrderScreen({ navigation }) {
  const { resolvedTheme } = useContext(ThemeContext);
  const [addressData, setAddressData] = useState(null);
  
  // State for the bottom sheet
  const [modalVisible, setModalVisible] = useState(false);

  const isDark = resolvedTheme === 'dark';
  const c = {
    bg: isDark ? '#121212' : '#F7F8FA',
    card: isDark ? '#1C1C1E' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#1A1A1A',
    subText: isDark ? '#A9A9A9' : '#737373',
    primary: '#9C27B0',
    border: isDark ? '#333333' : '#EAEAEC',
    // Added a subtle purple highlight for the selected address card
    highlightBg: isDark ? '#2D1636' : '#F3E5F5', 
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchAddr = async () => {
        // We fetch the full JSON string saved by AddressManager
        const data = await AsyncStorage.getItem('user_address_data');
        if (data) {
          setAddressData(JSON.parse(data));
        } else {
          setAddressData(null);
        }
      };
      fetchAddr();
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      {/* ── ADDRESS SECTION ── */}
      <View style={[styles.addressCard, { backgroundColor: c.card, borderColor: c.border }]}>
        <View style={styles.addressHeader}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>Delivery Address</Text>
          {addressData && (
            // Changed this to open the modal instead of navigating
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={{ color: c.primary, fontWeight: '600' }}>Change</Text>
            </TouchableOpacity>
          )}
        </View>

        {addressData ? (
          <View>
            <Text style={[styles.nameText, { color: c.text }]}>{addressData.name}</Text>
            <Text style={[styles.addressText, { color: c.subText }]}>
              {addressData.house}, {addressData.area}, {addressData.city}, {addressData.state} - {addressData.pincode}
            </Text>
            <Text style={[styles.phoneText, { color: c.subText }]}>Phone: {addressData.phone}</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.addAddrBtn, { borderColor: c.primary }]} 
            onPress={() => navigation.navigate('AddressManager')}
          >
            <Text style={[styles.addAddrText, { color: c.primary }]}>+ Add Delivery Address</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── REUSE CART LOGIC ── */}
      {/* Pass hideActions={true} if you don't want remove/wishlist buttons here */}
      <Cart theme={resolvedTheme} />

      {/* ── BOTTOM SHEET MODAL ── */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          {/* Tapping the dark overlay closes the modal */}
          <Pressable style={styles.overlayTouchable} onPress={() => setModalVisible(false)} />
          
          <View style={[styles.modalContent, { backgroundColor: c.card }]}>
            {/* Modal Header */}
            <View style={[styles.modalHeader, { borderBottomColor: c.border }]}>
              <Text style={[styles.modalTitle, { color: c.text }]}>CHANGE DELIVERY ADDRESS</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={[styles.closeIcon, { color: c.text }]}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Add New Address Button */}
            <TouchableOpacity 
              style={[styles.addNewRow, { borderBottomColor: c.border }]}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('AddressManager');
              }}
            >
              <Text style={[styles.addNewText, { color: c.primary }]}>+ ADD NEW ADDRESS</Text>
            </TouchableOpacity>

            {/* Saved Address Card */}
            {addressData ? (
              <View style={[styles.selectedAddressCard, { backgroundColor: c.highlightBg }]}>
                <View style={styles.cardHeaderRow}>
                  <Text style={[styles.cardName, { color: c.text }]}>{addressData.name}</Text>
                  {/* Purple Radio Button (Selected State) */}
                  <View style={[styles.radioOuter, { borderColor: c.primary }]}>
                    <View style={[styles.radioInner, { backgroundColor: c.primary }]} />
                  </View>
                </View>

                <Text style={[styles.cardAddressText, { color: c.subText }]}>
                  {addressData.house}, {addressData.area}, {addressData.city}, {addressData.state}, {addressData.pincode}
                </Text>
                
                <Text style={[styles.cardPhone, { color: c.subText }]}>+91 {addressData.phone}</Text>

                <TouchableOpacity 
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate('AddressManager');
                  }}
                >
                  <Text style={[styles.editText, { color: c.primary }]}>EDIT</Text>
                </TouchableOpacity>
              </View>
            ) : (
               <View style={{ padding: 20 }}>
                 <Text style={{ color: c.subText, textAlign: 'center' }}>No saved addresses found.</Text>
               </View>
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  addressCard: { padding: 16, margin: 12, borderRadius: 12, borderWidth: 1 },
  addressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  nameText: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  addressText: { fontSize: 14, lineHeight: 20 },
  phoneText: { fontSize: 14, marginTop: 4, fontWeight: '500' },
  
  addAddrBtn: { 
    padding: 12, 
    borderWidth: 1, 
    borderStyle: 'dashed', 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 8 
  },
  addAddrText: { fontWeight: '600' },

  // ── BOTTOM SHEET MODAL STYLES ──
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'flex-end' 
  },
  overlayTouchable: { flex: 1 },
  modalContent: { 
    borderTopLeftRadius: 12, 
    borderTopRightRadius: 12, 
    overflow: 'hidden' 
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 16, 
    borderBottomWidth: 1 
  },
  modalTitle: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
  closeIcon: { fontSize: 20, fontWeight: 'bold' },

  addNewRow: { padding: 16, borderBottomWidth: 1 },
  addNewText: { fontSize: 14, fontWeight: '700' },

  selectedAddressCard: { padding: 16 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardName: { fontSize: 16, fontWeight: 'bold' },
  
  radioOuter: { 
    height: 20, 
    width: 20, 
    borderRadius: 10, 
    borderWidth: 2, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  radioInner: { 
    height: 10, 
    width: 10, 
    borderRadius: 5
  },

  cardAddressText: { fontSize: 14, lineHeight: 22, marginBottom: 8 },
  cardPhone: { fontSize: 14, marginBottom: 16 },
  
  editText: { fontSize: 14, fontWeight: '700', marginBottom: 10 },
});