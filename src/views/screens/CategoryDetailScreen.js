import React, { useContext, useRef, useState } from 'react';
import { 
  View, FlatList, ActivityIndicator, Text, StyleSheet, 
  TouchableOpacity, RefreshControl, TextInput 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import Product from '../components/product';
import { useHomeViewModel } from '../../viewmodels/homeViewModel';
import { ThemeContext } from '../../navigation/AppNavigator';

export default function CategoryDetailScreen({ route, navigation }) { 
  const { categoryName, categorySlug } = route.params;
  const { resolvedTheme } = useContext(ThemeContext);
  const flatListRef = useRef(null);

  const { products, loading, refreshing, loadingMore, error, hasMore, refresh, loadMore } = useHomeViewModel(categorySlug);

  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // ─── NEW: Search States ───
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const scrollToTop = () => flatListRef.current?.scrollToOffset?.({ offset: 0, animated: true });

  const isDark = resolvedTheme === 'dark';
  const bgColor = isDark ? '#000' : '#F7F8FA';
  const textColor = isDark ? '#FFF' : '#1A1A1A';

  // ─── NEW: Local Search Filter ───
  // Instantly filters the loaded products as the user types
  const displayProducts = products.filter(p => {
    if (!searchQuery) return true;
    return p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
           p.brand?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading && products.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: bgColor }]}>
        <ActivityIndicator size="large" color="#5DB075" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      
      {/* ─── CUSTOM HEADER ─── */}
      <View style={[styles.header, { borderBottomColor: isDark ? '#333' : '#E0E0E0' }]}>
        
        {isSearching ? (
          // 1. SEARCH BAR VIEW
          <>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => {
                setIsSearching(false); // Close search
                setSearchQuery('');    // Clear input
              }}
            >
              <Ionicons name="chevron-back" size={24} color={textColor} />
            </TouchableOpacity>
            
            <TextInput
              style={[
                styles.searchInput, 
                { color: textColor, borderColor: isDark ? '#444' : '#E0E0E0', backgroundColor: isDark ? '#1A1A1A' : '#FFF' }
              ]}
              placeholder="Search products..."
              placeholderTextColor={isDark ? '#888' : '#999'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true} // Automatically opens keyboard
            />
            
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
                <Ionicons name="close-circle" size={20} color={textColor} />
              </TouchableOpacity>
            )}
          </>
        ) : (
          // 2. DEFAULT HEADER VIEW
          <>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color={textColor} />
            </TouchableOpacity>
            
            <Text style={[styles.headerText, { color: textColor }]} numberOfLines={1}>
              {categoryName}
            </Text>

            <View style={styles.headerIconsContainer}>
              <TouchableOpacity 
                style={styles.iconButton} 
                onPress={() => setIsSearching(true)} // Opens Search Bar
              >
                <Ionicons name="search" size={22} color={textColor} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.iconButton} 
                onPress={() => navigation.navigate('Wishlist')}
              >
                <Ionicons name="heart-outline" size={22} color={textColor} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.iconButton} 
                onPress={() => navigation.navigate('Cart')}
              >
                <Ionicons name="cart-outline" size={22} color={textColor} />
              </TouchableOpacity>
            </View>
          </>
        )}

      </View>

      {/* ─── LIST VIEW ─── */}
      {error && products.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : displayProducts.length === 0 && !loading ? (
        <View style={styles.centered}>
          <Text style={{ color: isDark ? '#888' : '#666', fontSize: 16 }}>
            No products match "{searchQuery}"
          </Text>
        </View>
      ) : (
        <FlatList
          numColumns={2}
          ref={flatListRef}
          data={displayProducts} // 👈 Using filtered list
          keyExtractor={(item, index) => String(`${item.id}-${index}`)}
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <Product item={item} theme={resolvedTheme} />
            </View>
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#5DB075" />}
          onEndReached={() => !loadingMore && hasMore && !isSearching && loadMore()} // Prevent loading pages while searching
          onEndReachedThreshold={0.5}
          ListFooterComponent={loadingMore ? <ActivityIndicator style={styles.loader} size="small" color="#5DB075" /> : null}
          onScroll={(e) => setShowScrollTop(e.nativeEvent.contentOffset.y > 500)}
          scrollEventThrottle={16}
        />
      )}

      {showScrollTop && (
        <TouchableOpacity style={styles.topButton} onPress={scrollToTop}>
          <Text style={styles.buttonText}>↑</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // ─── Header Styles ───
  header: { 
    flexDirection: 'row',       
    alignItems: 'center',       
    paddingVertical: 12, 
    paddingHorizontal: 16, 
    borderBottomWidth: 1,
    height: 60, // Fixed height keeps header from jumping
  },
  backButton: { 
    padding: 4, 
    marginRight: 12,            
  },
  headerText: { 
    fontSize: 18, 
    fontWeight: '600', 
    textTransform: 'capitalize',
    flex: 1 
  },
  
  headerIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 6,
    marginLeft: 12, 
  },

  // ─── New Search Input Styles ───
  searchInput: {
    flex: 1,
    height: 38,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  clearSearchBtn: {
    padding: 8,
    marginLeft: 6,
  },
  
  listContent: { paddingHorizontal: 8, paddingTop: 10, paddingBottom: 100 },
  gridItem: { flex: 1, marginHorizontal: 5, marginVertical: 5 },
  errorText: { color: '#B00020', fontSize: 16, fontWeight: '500' },
  loader: { paddingVertical: 20 },
  topButton: { position: 'absolute', bottom: 40, right: 20, backgroundColor: '#5DB075', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  buttonText: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
});