import React, { useContext, useRef, useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import Product from '../components/product';
import { useHomeViewModel } from '../viewmodels/homeViewModel';
import { useSearchViewModel } from '../viewmodels/searchViewModel';
import { ThemeContext } from './AppNavigator';

import SortModal from '../components/sortModal';
import CategoryModal from '../components/categoryModal';
import GenderModal from '../components/genderModal';
import ComprehensiveFilterModal from '../components/ComprehensiveFilterModal';

const CHIP_COLORS = [
  '#FCE4EC', '#F3E5F5', '#E8EAF6', '#E3F2FD',
  '#E0F2F1', '#F9FBE7', '#FFF8E1', '#FBE9E7',
  '#EDE7F6', '#E0F7FA', '#F1F8E9', '#FFF3E0',
];
const getCategoryColor = (index) => CHIP_COLORS[index % CHIP_COLORS.length];

// ─── Horizontal Category Row ─────────────────────────────────────────────────
const CategoryRow = ({ resolvedTheme, filteredCategories }) => {
  const navigation = useNavigation();
  const textColor = resolvedTheme === 'dark' ? '#fff' : '#1A1A1A';
  const allCatBg  = resolvedTheme === 'dark' ? '#2A2A2A' : '#FCE4EC';

  if (!filteredCategories?.length) return null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rowContainer}>
      <TouchableOpacity style={styles.chipWrapper} onPress={() => navigation.navigate('Category')} activeOpacity={0.75}>
        <View style={[styles.circle, { backgroundColor: allCatBg }]}>
          <Text style={styles.circleIcon}>⊞</Text>
        </View>
        <Text style={[styles.chipLabel, { color: textColor }]} numberOfLines={2}>Categories</Text>
      </TouchableOpacity>

      {filteredCategories.map((item, index) => {
        const key      = item.slug ?? item.id ?? index.toString();
        const slug     = item.slug ?? item.name?.toLowerCase() ?? '';
        const label    = item.name ?? (typeof item === 'string' ? item.replace(/-/g, ' ') : 'Category');
        const bg       = getCategoryColor(index + 1);
        const hasImage = !!item.image;
        
        return (
          <TouchableOpacity
            key={key}
            style={styles.chipWrapper}
            // 👈 Navigates to a new page instead of applying local filters
            onPress={() => navigation.navigate('CategoryDetail', { categoryName: label, categorySlug: slug })} 
            activeOpacity={0.75}
          >
            <View style={[styles.circle, { backgroundColor: hasImage ? '#f0f0f0' : bg }]}>
              {hasImage ? (
                <Image source={{ uri: item.image }} style={styles.circleImage} />
              ) : (
                <Text style={styles.circleInitial}>{label.charAt(0).toUpperCase()}</Text>
              )}
            </View>
            <Text style={[styles.chipLabel, { color: textColor, fontWeight: '500' }]} numberOfLines={2}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

// ─── Filter Bar Row ──────────────────────────────────────────────────────────
const FilterBar = ({ theme, onSortPress, onCategoryPress, onGenderPress, onComprehensiveFilterPress }) => {
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1A1A1A' : '#FFFFFF';
  const textColor = isDark ? '#E0E0E0' : '#333333';
  const borderColor = isDark ? '#333333' : '#E0E0E0';

  return (
    <View style={[styles.filterBarContainer, { backgroundColor: bgColor, borderTopColor: borderColor, borderBottomColor: borderColor }]}>
      <TouchableOpacity style={styles.filterButton} onPress={onSortPress}>
        <Text style={[styles.filterIcon, { color: textColor }]}>⇅</Text>
        <Text style={[styles.filterText, { color: textColor }]}>Sort</Text>
      </TouchableOpacity>
      <View style={[styles.divider, { backgroundColor: borderColor }]} />
      <TouchableOpacity style={styles.filterButton} onPress={onCategoryPress}>
        <Text style={[styles.filterText, { color: textColor }]}>Category</Text>
        <Text style={[styles.filterDropdown, { color: textColor }]}>⌄</Text>
      </TouchableOpacity>
      <View style={[styles.divider, { backgroundColor: borderColor }]} />
      <TouchableOpacity style={styles.filterButton} onPress={onGenderPress}>
        <Text style={[styles.filterText, { color: textColor }]}>Gender</Text>
        <Text style={[styles.filterDropdown, { color: textColor }]}>⌄</Text>
      </TouchableOpacity>
      <View style={[styles.divider, { backgroundColor: borderColor }]} />
      <TouchableOpacity style={styles.filterButton} onPress={onComprehensiveFilterPress}>
        <Text style={[styles.filterIcon, { color: textColor, fontSize: 16, marginBottom: 2 }]}>≡</Text>
        <Text style={[styles.filterText, { color: textColor }]}>Filters</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Main HomeScreen Component ────────────────────────────────────────────────
export default function HomeScreen() {
  const { resolvedTheme } = useContext(ThemeContext);
  const flatListRef = useRef(null);
  
  const { 
    products, loading, refreshing, loadingMore, error, hasMore, 
    refresh, loadMore, applySort, currentSort, applyCategories, currentCategories,
    applyGender, currentGender 
  } = useHomeViewModel(); 
  
  const { filteredCategories } = useSearchViewModel();

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isSortModalVisible, setSortModalVisible] = useState(false);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [isGenderModalVisible, setGenderModalVisible] = useState(false);
  const [isComprehensiveFilterModalVisible, setComprehensiveFilterModalVisible] = useState(false);

  const scrollToTop = () => flatListRef.current?.scrollToOffset?.({ offset: 0, animated: true });

  const handleSortSelection = (option) => { setSortModalVisible(false); applySort(option); };
  const handleCategoryApply = (categoriesArray) => { setCategoryModalVisible(false); applyCategories(categoriesArray); };
  const handleGenderApply = (gender) => { setGenderModalVisible(false); applyGender(gender); };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#5DB075" />
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={{ color: resolvedTheme === 'dark' ? '#888' : '#666', fontSize: 16 }}>
          No items match your filter.
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: resolvedTheme === 'dark' ? '#000' : '#F7F8FA' }]}>
      
      <FlatList
        numColumns={2}
        ref={flatListRef}
        data={products}
        keyExtractor={(item, index) => String(`${item.id}-${index}`)}
        ListHeaderComponent={
          <View>
            {/* 👈 Unlinked chips from currentCategories */}
            <CategoryRow 
              resolvedTheme={resolvedTheme} 
              filteredCategories={filteredCategories} 
            />
            <FilterBar 
              theme={resolvedTheme} 
              onSortPress={() => setSortModalVisible(true)} 
              onCategoryPress={() => setCategoryModalVisible(true)} 
              onGenderPress={() => setGenderModalVisible(true)}
              onComprehensiveFilterPress={() => setComprehensiveFilterModalVisible(true)}
            />
          </View>
        }
        ListEmptyComponent={renderEmptyState}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <Product item={item} theme={resolvedTheme} />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#5DB075" />}
        onEndReached={() => {
          if (!loading && !loadingMore && hasMore) {
            loadMore();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore && products.length > 0 ? <ActivityIndicator style={styles.loader} size="small" color="#5DB075" /> : null}
        onScroll={(e) => setShowScrollTop(e.nativeEvent.contentOffset.y > 500)}
        scrollEventThrottle={16}
      />

      {showScrollTop && (
        <TouchableOpacity style={styles.topButton} onPress={scrollToTop}>
          <Text style={styles.buttonText}>↑</Text>
        </TouchableOpacity>
      )}

      {/* Modals placed outside of FlatList to prevent rendering issues */}
      <SortModal visible={isSortModalVisible} onClose={() => setSortModalVisible(false)} selectedOption={currentSort} onSelectOption={handleSortSelection} theme={resolvedTheme} />
      <CategoryModal visible={isCategoryModalVisible} onClose={() => setCategoryModalVisible(false)} categories={filteredCategories || []} selectedCategories={currentCategories} onApply={handleCategoryApply} theme={resolvedTheme} />
      <GenderModal visible={isGenderModalVisible} onClose={() => setGenderModalVisible(false)} selectedGender={currentGender} onApply={handleGenderApply} theme={resolvedTheme} />
      <ComprehensiveFilterModal
        visible={isComprehensiveFilterModalVisible}
        onClose={() => setComprehensiveFilterModalVisible(false)}
        categories={filteredCategories || []}
        currentFilters={{
          categories: currentCategories,
          gender: currentGender,
        }}
        onApply={() => {
          setComprehensiveFilterModalVisible(false);
        }}
        theme={resolvedTheme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyContainer: { paddingTop: 60, alignItems: 'center' },
  listContent: { paddingHorizontal: 8, paddingTop: 4, paddingBottom: 100 },
  gridItem: { flex: 1, marginHorizontal: 5, marginVertical: 5 },
  errorText: { color: '#B00020', fontSize: 16, fontWeight: '500' },
  loader: { paddingVertical: 20 },

  rowContainer: { paddingHorizontal: 12, paddingVertical: 14, alignItems: 'flex-start' },
  chipWrapper: { alignItems: 'center', marginRight: 16, width: 68 },
  circle: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  circleImage: { width: 64, height: 64, borderRadius: 32, resizeMode: 'cover' },
  circleIcon: { fontSize: 28, color: '#E91E63' },
  circleInitial: { fontSize: 24, fontWeight: '700', color: '#555' },
  chipLabel: { fontSize: 11, fontWeight: '500', marginTop: 6, textAlign: 'center', textTransform: 'capitalize', lineHeight: 14 },
  
  filterBarContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderTopWidth: 1, borderBottomWidth: 1, marginBottom: 8 },
  filterButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  filterText: { fontSize: 14, fontWeight: '500', marginHorizontal: 4 },
  filterIcon: { fontSize: 14, fontWeight: 'bold' },
  filterDropdown: { fontSize: 16, fontWeight: '300', marginTop: -4 },
  divider: { width: 1, height: 20 },
  
  topButton: { position: 'absolute', bottom: 80, right: 20, backgroundColor: '#5DB075', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  buttonText: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
});