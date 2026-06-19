import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';

const Search = ({ theme, listRef }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const colors = {
    light: { background: '#F7F8FA', text: '#1A1A1A', card: '#FFFFFF', primary: '#5DB075', searchBg: '#FFFFFF', searchPlaceholder: '#999', border: '#E5E5E5' },
    dark: { background: '#000', text: '#fff', card: '#121212', primary: '#5DB075', searchBg: '#1A1A1A', searchPlaceholder: '#777', border: '#333' }
  };
  const themeColors = theme === 'dark' ? colors.dark : colors.light;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://dummyjson.com/products/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
      </View>
    );
  }

  const filteredCategories = categories.filter(item => {
    const itemName = item.name || (typeof item === 'string' ? item.replace('-', ' ') : 'Category');
    return itemName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: themeColors.searchBg, color: themeColors.text, borderColor: themeColors.border }]}
          placeholder="Search categories..."
          placeholderTextColor={themeColors.searchPlaceholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <Text style={[styles.title, { color: themeColors.text }]}>Browse by Category</Text>
      <FlatList
        ref={listRef}
        data={filteredCategories}
        keyExtractor={(item, index) => item.slug || item.toString() || index.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.card, { backgroundColor: themeColors.card }]}>
            <Text style={[styles.itemText, { color: themeColors.text }]}>
              {item.name || (typeof item === 'string' ? item.replace('-', ' ') : 'Category')}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    margin: 6,
    paddingVertical: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
});

export default Search;