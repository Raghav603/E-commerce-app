import React from 'react';
import { 
  View, Text, StyleSheet, FlatList, ActivityIndicator, 
  TouchableOpacity, TextInput, Image 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useSearchViewModel } from '../viewmodels/searchViewModel';

const Search = ({ theme, listRef }) => {
  const { loading, filteredCategories, searchQuery, setSearchQuery } = useSearchViewModel();
  const navigation = useNavigation();

  const colors = {
    light: { background: '#F7F8FA', text: '#1A1A1A', card: '#FFFFFF', primary: '#5DB075', searchBg: '#FFFFFF', searchPlaceholder: '#999', border: '#E5E5E5' },
    dark: { background: '#000', text: '#fff', card: '#121212', primary: '#5DB075', searchBg: '#1A1A1A', searchPlaceholder: '#777', border: '#333' },
  };
  const themeColors = theme === 'dark' ? colors.dark : colors.light;

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      
      {/* ─── SEARCH BAR ─── */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { 
            backgroundColor: themeColors.searchBg, 
            color: themeColors.text, 
            borderColor: themeColors.border 
          }]}
          placeholder="Search categories..."
          placeholderTextColor={themeColors.searchPlaceholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <Text style={[styles.title, { color: themeColors.text }]}>Browse by Category</Text>
      
      {/* ─── CATEGORY GRID ─── */}
      <FlatList
        ref={listRef}
        data={filteredCategories}
        keyExtractor={(item, index) => item.slug || item.toString() || index.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const categoryName = item.name || (typeof item === 'string' ? item.replace('-', ' ') : 'Category');
          const categorySlug = item.slug || (typeof item === 'string' ? item : 'category');

          return (
            <TouchableOpacity 
              style={[styles.card, { backgroundColor: themeColors.card }]}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('CategoryDetail', { 
                categoryName: categoryName, 
                categorySlug: categorySlug 
              })}
            >
              {/* 1. ABSOLUTE BACKGROUND: Image */}
              {!!item?.image && (
                <Image
                  source={{ uri: item.image }}
                  style={styles.categoryImage}
                  resizeMode="cover"
                />
              )}

              {/* 2. ABSOLUTE BACKGROUND: Dark Overlay */}
              {!!item?.image && <View style={styles.imageOverlay} />}
              
              {/* 3. RELATIVE FOREGROUND: Text naturally sits on top */}
              <Text style={[
                styles.imageTitle, 
                { color: item?.image ? '#FFFFFF' : themeColors.text }
              ]}>
                {categoryName}
              </Text>
              
            </TouchableOpacity>
          );
        }}
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
  
  // ─── CARD STYLES ───
  card: {
    flex: 1,
    margin: 6,
    height: 120, // Fixed height makes the grid look uniform and clean
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    // 👇 This centers the text naturally without needing absolute positioning!
    justifyContent: 'center', 
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  categoryImage: {
    position: 'absolute', // Pushes image to the background layer
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute', // Pushes tint to the background layer, above the image
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.45)', // 45% black tint
  },
  imageTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'capitalize',
    letterSpacing: 0.5,
    // 👇 Adds a subtle drop shadow to make the text pop against the image
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default Search;