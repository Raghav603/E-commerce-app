import React, { useContext, useRef, useState } from 'react';
import {
  View, FlatList, ActivityIndicator, RefreshControl,
  TouchableOpacity, Text, StyleSheet, ScrollView, Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Product from '../components/product';
import { useHomeViewModel } from '../viewmodels/homeViewModel';
import { useSearchViewModel } from '../viewmodels/searchViewModel';
import { ThemeContext } from './AppNavigator';

// Palette of soft background colors for category circles
const CHIP_COLORS = [
  '#FCE4EC', '#F3E5F5', '#E8EAF6', '#E3F2FD',
  '#E0F2F1', '#F9FBE7', '#FFF8E1', '#FBE9E7',
  '#EDE7F6', '#E0F7FA', '#F1F8E9', '#FFF3E0',
];

const getCategoryColor = (index) => CHIP_COLORS[index % CHIP_COLORS.length];

// ─── Horizontal category row ──────────────────────────────────────────────────
const CategoryRow = ({ resolvedTheme }) => {
  const navigation = useNavigation();
  const { filteredCategories } = useSearchViewModel();

  const textColor = resolvedTheme === 'dark' ? '#fff' : '#1A1A1A';
  const allCatBg  = resolvedTheme === 'dark' ? '#2A2A2A' : '#FCE4EC';

  if (!filteredCategories?.length) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.rowContainer}
    >
      {/* "Categories" button — navigates to Category tab */}
      <TouchableOpacity
        style={styles.chipWrapper}
        onPress={() => navigation.navigate('Category')}
        activeOpacity={0.75}
      >
        <View style={[styles.circle, { backgroundColor: allCatBg }]}>
          <Text style={styles.circleIcon}>⊞</Text>
        </View>
        <Text style={[styles.chipLabel, { color: textColor }]} numberOfLines={2}>
          Categories
        </Text>
      </TouchableOpacity>

      {/* Dynamic category chips */}
      {filteredCategories.map((item, index) => {
        const key      = item.slug ?? item.id ?? index.toString();
        const label    = item.name ?? (typeof item === 'string' ? item.replace(/-/g, ' ') : 'Category');
        const bg       = getCategoryColor(index + 1);
        const hasImage = !!item.image;

        return (
          <TouchableOpacity
            key={key}
            style={styles.chipWrapper}
            onPress={() => navigation.navigate('CategoryDetail', {
              categoryName: label,
              categorySlug: item.slug ?? key,
            })}
            activeOpacity={0.75}
          >
            <View style={[styles.circle, { backgroundColor: hasImage ? '#f0f0f0' : bg }]}>
              {hasImage ? (
                <Image source={{ uri: item.image }} style={styles.circleImage} />
              ) : (
                <Text style={styles.circleInitial}>
                  {label.charAt(0).toUpperCase()}
                </Text>
              )}
            </View>
            <Text style={[styles.chipLabel, { color: textColor }]} numberOfLines={2}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

// ─── HomeScreen ───────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const { resolvedTheme } = useContext(ThemeContext);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const flatListRef = useRef(null);

  const { products, loading, refreshing, loadingMore, error, hasMore, refresh, loadMore } = useHomeViewModel();

  const scrollToTop = () => flatListRef.current?.scrollToOffset?.({ offset: 0, animated: true });

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: resolvedTheme === 'dark' ? '#000' : '#F7F8FA' }]}>
        <ActivityIndicator size="large" color="#5DB075" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: resolvedTheme === 'dark' ? '#000' : '#F7F8FA' }]}>
      {error ? (
        <View style={[styles.centered, { backgroundColor: resolvedTheme === 'dark' ? '#000' : '#F7F8FA' }]}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          numColumns={2}
          ref={flatListRef}
          data={products}
          keyExtractor={(item) => String(item.id)}
          ListHeaderComponent={<CategoryRow resolvedTheme={resolvedTheme} />}
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <Product item={item} theme={resolvedTheme} />
            </View>
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#5DB075" />
          }
          onEndReached={() => !loadingMore && hasMore && loadMore()}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore
              ? <ActivityIndicator style={styles.loader} size="small" color="#5DB075" />
              : null
          }
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
  centered:  { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // ── Grid ────────────────────────────────────────────────
  listContent: {
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 100,
  },
  gridItem: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 5,
  },

  errorText: { color: '#B00020', fontSize: 16, fontWeight: '500' },
  loader:    { paddingVertical: 20 },

  // ── Category row ────────────────────────────────────────
  rowContainer: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    alignItems: 'flex-start',
  },
  chipWrapper: {
    alignItems: 'center',
    marginRight: 16,
    width: 68,
  },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  circleImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    resizeMode: 'cover',
  },
  circleIcon: {
    fontSize: 28,
    color: '#E91E63',
  },
  circleInitial: {
    fontSize: 24,
    fontWeight: '700',
    color: '#555',
  },
  chipLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 6,
    textAlign: 'center',
    textTransform: 'capitalize',
    lineHeight: 14,
  },

  // ── Scroll to top ────────────────────────────────────────
  topButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#5DB075',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  buttonText: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
});