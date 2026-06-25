import React, { useContext, useRef, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import Product from '../components/product';
import { useHomeViewModel } from '../viewmodels/homeViewModel';
import { ThemeContext } from './AppNavigator';

// 👇 1. Extract navigation from the component props
export default function CategoryDetailScreen({ route, navigation }) { 
  const { categoryName, categorySlug } = route.params;
  const { resolvedTheme } = useContext(ThemeContext);
  const flatListRef = useRef(null);

  const { products, loading, refreshing, loadingMore, error, hasMore, refresh, loadMore } = useHomeViewModel(categorySlug);

  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollToTop = () => flatListRef.current?.scrollToOffset?.({ offset: 0, animated: true });

  const isDark = resolvedTheme === 'dark';
  const bgColor = isDark ? '#000' : '#F7F8FA';
  const textColor = isDark ? '#FFF' : '#1A1A1A';

  if (loading && products.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: bgColor }]}>
        <ActivityIndicator size="large" color="#5DB075" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      
      {/* 👇 2. NEW CUSTOM HEADER: Back Button + Category Name */}
      <View style={[styles.header, { borderBottomColor: isDark ? '#333' : '#E0E0E0' }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={[styles.backIcon, { color: textColor }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: textColor }]} numberOfLines={1}>
          {categoryName}
        </Text>
      </View>

      {error && products.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          numColumns={2}
          ref={flatListRef}
          data={products}
          keyExtractor={(item, index) => String(`${item.id}-${index}`)}
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <Product item={item} theme={resolvedTheme} />
            </View>
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#5DB075" />}
          onEndReached={() => !loadingMore && hasMore && loadMore()}
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
  
  // 👇 3. Updated Header Styles
  header: { 
    flexDirection: 'row',       // Aligns items horizontally
    alignItems: 'center',       // Vertically centers the arrow and text
    paddingVertical: 16, 
    paddingHorizontal: 16, 
    borderBottomWidth: 1 
  },
  backButton: { 
    padding: 4, 
    marginRight: 12,            // Adds spacing between the arrow and the title
  },
  backIcon: { 
    fontSize: 26,               // Made the arrow large and readable
    fontWeight: '600',
    marginTop: -2,              // Visual adjustment to align perfectly with text
  },
  headerText: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    textTransform: 'capitalize',
    flex: 1                     // Ensures long category names truncate safely
  },
  
  listContent: { paddingHorizontal: 8, paddingTop: 10, paddingBottom: 100 },
  gridItem: { flex: 1, marginHorizontal: 5, marginVertical: 5 },
  errorText: { color: '#B00020', fontSize: 16, fontWeight: '500' },
  loader: { paddingVertical: 20 },
  topButton: { position: 'absolute', bottom: 40, right: 20, backgroundColor: '#5DB075', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  buttonText: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
});