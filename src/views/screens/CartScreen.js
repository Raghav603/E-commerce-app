import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import Cart from '../components/Cart';
import { ThemeContext } from '../../navigation/AppNavigator';

export default function CartScreen() {
  const { resolvedTheme } = useContext(ThemeContext);
  return (
    <View style={[styles.container, { backgroundColor: resolvedTheme === 'dark' ? '#000' : '#F7F8FA' }]}>
      <Cart theme={resolvedTheme} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });