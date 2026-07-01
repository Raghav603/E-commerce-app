import React, { useState, useMemo, useContext } from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator,
  TextInput, TouchableOpacity
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import Product from '../components/product';
import { useHomeViewModel } from '../../viewmodels/homeViewModel';
import { ThemeContext } from '../../navigation/AppNavigator';

const ProductSearchScreen = () => {
  const { resolvedTheme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const { products, loading: productsLoading } = useHomeViewModel();

  const [searchQuery, setSearchQuery] = useState('');

  const isDark = resolvedTheme === 'dark';
  const colors = {
    background: isDark ? '#000' : '#F7F8FA',
    text: isDark ? '#fff' : '#1A1A1A',
    subText: isDark ? '#A9A9A9' : '#777',
    primary: '#5DB075',
    searchBg: isDark ? '#1A1A1A' : '#FFFFFF',
    searchPlaceholder: isDark ? '#777' : '#999',
    border: isDark ? '#333' : '#E5E5E5',
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return []; // Don't show anything until user searches
    }
    const query = searchQuery.toLowerCase();
    return products.filter(p =>
      p.title?.toLowerCase().includes(query) ||
      p.name?.toLowerCase().includes(query) ||
      p.brand?.toLowerCase().includes(query) ||
      p.category?.toLowerCase().includes(query)
    );
  }, [searchQuery, products]);

  const renderEmptyState = () => {
    if (productsLoading && searchQuery) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }
    if (!searchQuery.trim()) {
      return (
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={[styles.emptyText, { color: colors.text }]}>Search for Products</Text>
          <Text style={[styles.emptySubText, { color: colors.subText }]}>
            Find items by name, brand, or category.
          </Text>
        </View>
      );
    }
    if (filteredProducts.length === 0) {
      return (
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>🤷</Text>
          <Text style={[styles.emptyText, { color: colors.text }]}>No Results Found</Text>
          <Text style={[styles.emptySubText, { color: colors.subText }]}>
            No products match "{searchQuery}". Try a different search term.
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.searchHeader, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <TextInput
          style={[styles.searchInput, {
            backgroundColor: colors.searchBg,
            color: colors.text,
            borderColor: colors.border
          }]}
          placeholder="Search for products, brands..."
          placeholderTextColor={colors.searchPlaceholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus={true}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={colors.subText} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => String(item.id ?? item.name)}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <Product item={item} theme={resolvedTheme} />
          </View>
        )}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, borderBottomWidth: 1 },
  backButton: { paddingRight: 12 },
  searchInput: { flex: 1, height: 44, borderWidth: 1, borderRadius: 10, paddingHorizontal: 16, fontSize: 16 },
  clearButton: { position: 'absolute', right: 28, height: 44, justifyContent: 'center' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, marginTop: 60 },
  listContent: { paddingHorizontal: 8, paddingTop: 8, paddingBottom: 20 },
  gridItem: { flex: 1, marginHorizontal: 5, marginVertical: 5 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: '600', textAlign: 'center' },
  emptySubText: { fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },
});

export default ProductSearchScreen;