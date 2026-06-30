import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../../navigation/AppNavigator';

export default function MyOrderScreen() {
  const { resolvedTheme } = useContext(ThemeContext);
  return (
    <View style={[styles.container, { backgroundColor: resolvedTheme === 'dark' ? '#000' : '#F7F8FA' }]}>
      <View style={styles.centered}>
        <Text style={{ color: resolvedTheme === 'dark' ? '#fff' : '#1A1A1A', fontSize: 18, fontWeight: 'bold' }}>
          My Orders
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});