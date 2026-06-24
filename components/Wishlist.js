import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';

import { useSelector } from 'react-redux';

import Product from './product';



const Wishlist = ({ theme, setWishlistSearchToggle }) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const colors = {
    light: { background: '#F7F8FA', text: '#1A1A1A', emptyText: '#777', searchBg: '#FFFFFF', border: '#E5E5E5', secondaryText: '#777' },
    dark: { background: '#000', text: '#fff', emptyText: '#A9A9A9', searchBg: '#1A1A1A', border: '#333', secondaryText: '#A9A9A9' }
  };
  const themeColors = theme === 'dark' ? colors.dark : colors.light;

  const likedItems = useSelector(state => state.WishlistReducer || []);


  // Parent passes a toggle function through MVVM/viewmodel
  useEffect(() => {
    if (typeof setWishlistSearchToggle === 'function') {
      setWishlistSearchToggle(() => () => setSearchVisible((prev) => !prev));
    }
  }, [setWishlistSearchToggle]);


  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {searchVisible && (
        <View style={styles.searchContainer}>
          <TextInput style={[styles.searchInput, { backgroundColor: themeColors.searchBg, color: themeColors.text, borderColor: themeColors.border }]} placeholder="Search in wishlist..." placeholderTextColor={themeColors.secondaryText} value={searchQuery} onChangeText={setSearchQuery} />
        </View>
      )}
      {likedItems.length === 0 && !searchQuery ? (
        <View style={styles.centered}>
          <Text style={{ color: themeColors.emptyText, fontSize: 18 }}>Your wishlist is empty.</Text>
        </View>
      ) : (
        <FlatList
          data={likedItems}
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
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  itemContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
  },
});


export default Wishlist;