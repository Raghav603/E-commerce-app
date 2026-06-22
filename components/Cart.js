import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from './redux/action';
import Product from './product';

const Cart = ({ theme }) => {
  const cartItems = useSelector(state => state.Reducer);
  const dispatch = useDispatch();

  const colors = {
    light: { background: '#F7F8FA', text: '#1A1A1A', emptyText: '#777' },
    dark: { background: '#000', text: '#fff', emptyText: '#A9A9A9' }
  };
  const themeColors = theme === 'dark' ? colors.dark : colors.light;

  // Group items to handle quantities
  const groupedItems = cartItems.reduce((acc, currentItem) => {
    const existingItem = acc.find(item => item.id === currentItem.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      acc.push({ ...currentItem, quantity: 1 });
    }
    return acc;
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {groupedItems.length === 0 ? (
        <View style={styles.centered}>
          <Text style={{ color: themeColors.emptyText, fontSize: 18 }}>Your cart is empty.</Text>
        </View>
      ) : (
        <FlatList
          data={groupedItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.productWrapper}>
              <Product item={item} theme={theme} />
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  centered: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  listContent: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20,
  },
  productWrapper: {
    flex: 1,
    marginHorizontal: 8,
    maxWidth: '100%', // Ensure it doesn't overflow on single column
  },
});

export default Cart;