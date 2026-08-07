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
import Ionicons from 'react-native-vector-icons/Ionicons';

import Product from '../components/product';
import { useHomeViewModel } from '../../viewmodels/homeViewModel';
import { useSearchViewModel } from '../../viewmodels/searchViewModel';
import { ThemeContext } from '../../navigation/AppNavigator';

import SortModal from '../components/modals/sortModal';
import CategoryModal from '../components/modals/categoryModal';
import GenderModal from '../components/modals/genderModal';
import ComprehensiveFilterModal from '../components/modals/ComprehensiveFilterModal';

const CHIP_COLORS = [
  '#FCE4EC', '#F3E5F5', '#E8EAF6', '#E3F2FD',
  '#E0F2F1', '#F9FBE7', '#FFF8E1', '#FBE9E7'
];
const getCategoryColor = (index) => CHIP_COLORS[index % CHIP_COLORS.length];


// ─── Horizontal Category Row (Chips ONLY navigate) ───────────────────────────
const CategoryRow = ({ resolvedTheme, filteredCategories }) => {
  const navigation = useNavigation();
  const textColor = resolvedTheme === 'dark' ? '#fff' : '#1A1A1A';
  const allCatBg  = resolvedTheme === 'dark' ? '#1A2E22' : '#E8F5E9';

  if (!filteredCategories?.length) return null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rowContainer}>
      <TouchableOpacity style={styles.chipWrapper} onPress={() => navigation.navigate('Category')} activeOpacity={0.75}>
        <View style={[styles.circle, styles.allCategoriesCircle, { backgroundColor: allCatBg }]}>
          <View style={styles.gridIconContainer}>
            <View style={[styles.gridDot, { backgroundColor: '#5DB075' }]} />
            <View style={[styles.gridDot, { backgroundColor: '#5DB075' }]} />
            <View style={[styles.gridDot, { backgroundColor: '#5DB075' }]} />
            <View style={[styles.gridDot, { backgroundColor: '#5DB075' }]} />
          </View>
        </View>
        <Text style={[styles.chipLabel, { color: textColor }]} numberOfLines={2}>All{'\n'}Categories</Text>
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
        <Text style={[styles.filterIcon, { color: '#5DB075', fontSize: 16, marginBottom: 2 }]}>≡</Text>
        <Text style={[styles.filterText, { color: '#5DB075', fontWeight: '700' }]}>Filters</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Main HomeScreen Component ────────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  const { resolvedTheme } = useContext(ThemeContext);
  const flatListRef = useRef(null);
  
  const isDark = resolvedTheme === 'dark';
  const colors = {
    searchBg: isDark ? '#1A1A1A' : '#FFFFFF',
    border: isDark ? '#333' : '#E0E0E0',
    secondaryText: isDark ? '#A9A9A9' : '#777',
    text: isDark ? '#FFF' : '#1A1A1A',
  };

  const { 
    products, loading, refreshing, loadingMore, error, hasMore, 
    refresh, loadMore, applySort, currentSort, 
    filters, applyCategories, applyGender, applyAllFilters 
  } = useHomeViewModel(); 
  
  // Safe search view model hook to prevent undefined crashes
  const searchData = useSearchViewModel() || {};
  const filteredCategories = searchData.filteredCategories || [];

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isSortModalVisible, setSortModalVisible] = useState(false);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [isGenderModalVisible, setGenderModalVisible] = useState(false);
  const [isComprehensiveFilterModalVisible, setComprehensiveFilterModalVisible] = useState(false);

  const scrollToTop = () => flatListRef.current?.scrollToOffset?.({ offset: 0, animated: true });

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
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#F7F8FA' }]}>
      
      <FlatList
        numColumns={2}
        ref={flatListRef}
        data={products}
        keyExtractor={(item, index) => String(`${item.id}-${index}`)}
        ListHeaderComponent={
          <View>
            {/* SEARCH BAR IMPLEMENTED HERE */}
            <TouchableOpacity
              style={[styles.homeSearchBar, { backgroundColor: colors.searchBg, borderColor: colors.border }]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Search')}
            >
              <Ionicons name="search" size={20} color={colors.secondaryText} style={{ marginRight: 10 }} />
              <Text style={{ color: colors.secondaryText, flex: 1 }}>Search for products...</Text>
              <Ionicons name="scan-outline" size={20} color={colors.text} />
            </TouchableOpacity>

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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        onEndReached={() => !loading && !loadingMore && hasMore && loadMore()}
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

      <SortModal 
        visible={isSortModalVisible} 
        onClose={() => setSortModalVisible(false)} 
        selectedOption={currentSort} 
        onSelectOption={(o) => { setSortModalVisible(false); applySort(o); }} 
        theme={resolvedTheme} 
      />
      
      <CategoryModal 
        visible={isCategoryModalVisible} 
        onClose={() => setCategoryModalVisible(false)} 
        categories={filteredCategories} 
        selectedCategory={filters.categories} 
        onApply={(c) => { setCategoryModalVisible(false); applyCategories(c); }} 
        theme={resolvedTheme} 
      />
      
      <GenderModal 
        visible={isGenderModalVisible} 
        onClose={() => setGenderModalVisible(false)} 
        selectedGender={filters.gender} 
        onApply={(g) => { setGenderModalVisible(false); applyGender(g); }} 
        theme={resolvedTheme} 
      />
      
      <ComprehensiveFilterModal
        visible={isComprehensiveFilterModalVisible}
        onClose={() => setComprehensiveFilterModalVisible(false)}
        categories={filteredCategories}
        currentFilters={filters}
        onApply={(newFilters) => {
          setComprehensiveFilterModalVisible(false);
          applyAllFilters(newFilters); //  Correctly applies all advanced filters!
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
  allCategoriesCircle: { borderWidth: 1.5, borderColor: '#5DB075' },
  gridIconContainer: { width: 24, height: 24, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridDot: { width: 10, height: 10, borderRadius: 3 },
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
  
  topButton: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#5DB075', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  buttonText: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  homeSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
});