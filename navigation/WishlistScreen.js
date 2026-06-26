import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import Wishlist from '../components/Wishlist';
import { ThemeContext, WishlistSearchRef } from './AppNavigator';

export default function WishlistScreen() {
  const { resolvedTheme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: resolvedTheme === 'dark' ? '#000' : '#F7F8FA' }]}>
      <Wishlist
        theme={resolvedTheme}
        // Wishlist will call this with the toggle fn — we store it in the shared ref
        setWishlistSearchToggle={(fn) => { WishlistSearchRef.current = fn; }}
      />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });