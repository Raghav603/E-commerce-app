import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import SearchScreen from './SearchScreen';
import { ThemeContext } from '../../navigation/AppNavigator';

export default function CategoryScreen() {
  const { resolvedTheme } = useContext(ThemeContext);
  return (
    <View style={[styles.container, { backgroundColor: resolvedTheme === 'dark' ? '#000' : '#F7F8FA' }]}>
      <SearchScreen theme={resolvedTheme} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });