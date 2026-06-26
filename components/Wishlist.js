import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import Product from './product';

const SCREEN_WIDTH = Dimensions.get('window').width;
// Match HomeScreen grid: paddingHorizontal 8, marginHorizontal 5 each side
const ITEM_WIDTH = (SCREEN_WIDTH - 16 - 20) / 2; // 16=list padding, 20=margins

const Wishlist = ({ theme, setWishlistSearchToggle }) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery]     = useState('');

  const colors = {
    light: { background: '#F7F8FA', text: '#1A1A1A', emptyText: '#777', searchBg: '#FFFFFF', border: '#E5E5E5', secondaryText: '#777' },
    dark:  { background: '#000',    text: '#fff',    emptyText: '#A9A9A9', searchBg: '#1A1A1A', border: '#333', secondaryText: '#A9A9A9' },
  };
  const themeColors = theme === 'dark' ? colors.dark : colors.light;

  const likedItems = useSelector(state => state.WishlistReducer || []);

  const displayedItems = useMemo(() => {
    if (!searchQuery.trim()) return likedItems;
    const q = searchQuery.toLowerCase();
    return likedItems.filter(item =>
      (item.name ?? item.title ?? '').toLowerCase().includes(q)
    );
  }, [likedItems, searchQuery]);

  // Register the toggle function so the header 🔍 button can call it
  useEffect(() => {
    if (typeof setWishlistSearchToggle === 'function') {
      setWishlistSearchToggle(() => () => {
        setSearchVisible(prev => !prev);
        setSearchQuery(''); // clear query when toggling off
      });
    }
  }, [setWishlistSearchToggle]);

  const isEmpty    = likedItems.length === 0;
  const noResults  = !isEmpty && displayedItems.length === 0;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>

      {/* Search bar */}
      {searchVisible && (
        <View style={[styles.searchContainer, { borderBottomColor: themeColors.border }]}>
          <TextInput
            style={[styles.searchInput, { backgroundColor: themeColors.searchBg, color: themeColors.text, borderColor: themeColors.border }]}
            placeholder="Search in wishlist..."
            placeholderTextColor={themeColors.secondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>
      )}

      {isEmpty ? (
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>🤍</Text>
          <Text style={[styles.emptyText, { color: themeColors.emptyText }]}>Your wishlist is empty.</Text>
          <Text style={[styles.emptySubText, { color: themeColors.secondaryText }]}>
            Tap the heart on any product to save it here.
          </Text>
        </View>

      ) : noResults ? (
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={[styles.emptyText, { color: themeColors.emptyText }]}>No results found.</Text>
          <Text style={[styles.emptySubText, { color: themeColors.secondaryText }]}>
            Try a different search term.
          </Text>
        </View>

      ) : (
        <FlatList
          data={displayedItems}
          keyExtractor={(item) => String(item.id ?? item.name)}
          numColumns={2}
          renderItem={({ item }) => (
            // Fixed width on every item — prevents single/odd items from stretching
            <View style={[styles.gridItem, { width: ITEM_WIDTH }]}>
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
  container:    { flex: 1 },
  centered:     { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  emptyIcon:    { fontSize: 48, marginBottom: 12 },
  emptyText:    { fontSize: 18, fontWeight: '600', marginBottom: 6, textAlign: 'center' },
  emptySubText: { fontSize: 13, textAlign: 'center', lineHeight: 18 },

  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
  },

  listContent: { paddingHorizontal: 8, paddingTop: 8, paddingBottom: 100 },
  gridItem:    { marginHorizontal: 5, marginVertical: 5 },
});

export default Wishlist;