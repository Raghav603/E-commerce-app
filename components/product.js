import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import {addToCart, removeFromCart} from './redux/action';

const Product = ({item, theme}) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.Reducer);

  const colors = {
    light: { text: '#222', card: '#fff', counterBg: '#EEF8F0' },
    dark: { text: '#fff', card: '#121212', counterBg: '#222' }
  };
  const themeColors = theme === 'dark' ? colors.dark : colors.light;

  const itemCount = cartItems.filter(
    x => x.name === item.name,
  ).length;

  return (
    <View style={[styles.card, { backgroundColor: themeColors.card }]}>
      <Image
        source={{uri: item.image}}
        style={styles.image}
      />

      <Text style={[styles.name, { color: themeColors.text }]} numberOfLines={2}>
        {item.name}
      </Text>

      <View style={styles.bottomRow}>
        <Text style={styles.price}>
          {item.price}
        </Text>

        {itemCount > 0 ? (
          <View style={[styles.counter, { backgroundColor: themeColors.counterBg }]}>
            <TouchableOpacity
              onPress={() =>
                dispatch(removeFromCart(item.name))
              }>
              <Text style={styles.counterText}>−</Text>
            </TouchableOpacity>

            <Text style={[styles.count, { color: themeColors.text }]}>
              {itemCount}
            </Text>

            <TouchableOpacity
              onPress={() =>
                dispatch(addToCart(item))
              }>
              <Text style={styles.counterText}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() =>
              dispatch(addToCart(item))
            }>
            <Text style={styles.plus}>+</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },

  image: {
    width: '100%',
    height: 150,
    borderRadius: 15,
    resizeMode: 'cover',
  },

  name: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: 12,
  },

  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#5DB075',
  },

  bottomRow: {
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#5DB075',
    justifyContent: 'center',
    alignItems: 'center',
  },

  plus: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },

  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  count: {
    marginHorizontal: 12,
    fontWeight: '700',
  },

  counterText: {
    fontSize: 22,
    color: '#5DB075',
  },
});

export default Product;