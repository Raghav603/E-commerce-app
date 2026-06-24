import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import Search from '../components/search';
import { ThemeContext } from './AppNavigator';

export default function CategoryScreen() {
  const { resolvedTheme } = useContext(ThemeContext);
  return (
    <View style={[styles.container, { backgroundColor: resolvedTheme === 'dark' ? '#000' : '#F7F8FA' }]}>
      <Search theme={resolvedTheme} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });