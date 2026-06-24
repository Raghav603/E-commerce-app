import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import Wishlist from '../components/Wishlist';
import { useWishlistViewModel } from '../viewmodels/wishlistViewModel';
import { ThemeContext } from './AppNavigator';

export default function WishlistScreen() {
  const { resolvedTheme } = useContext(ThemeContext);
  const { wishlistSearchToggle } = useWishlistViewModel();
  return (
    <View style={[styles.container, { backgroundColor: resolvedTheme === 'dark' ? '#000' : '#F7F8FA' }]}>
      <Wishlist theme={resolvedTheme} setWishlistSearchToggle={wishlistSearchToggle} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });