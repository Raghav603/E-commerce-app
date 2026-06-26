import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  SafeAreaView,
} from 'react-native';

const TABS = ['Category', 'Gender', 'Price', 'Rating', 'Discount'];

const GENDERS = ['Man', 'Woman', 'Boy', 'Girl'];

// Prices converted to INR (×84)
const PRICES = [
  { label: 'Under ₹4,200',        min: 0,     max: 4200   },
  { label: '₹4,200 – ₹16,800',   min: 4200,  max: 16800  },
  { label: '₹16,800 – ₹42,000',  min: 16800, max: 42000  },
  { label: 'Over ₹42,000',        min: 42000, max: 999999 },
];

const RATINGS = [
  { label: '4★ & above', val: 4 },
  { label: '3★ & above', val: 3 },
  { label: '2★ & above', val: 2 },
];

const DISCOUNTS = [
  { label: '10% or more', val: 10 },
  { label: '20% or more', val: 20 },
  { label: '50% or more', val: 50 },
];

export default function ComprehensiveFilterModal({
  visible,
  onClose,
  categories = [],
  currentFilters,
  onApply,
  theme,
}) {
  const isDark       = theme === 'dark';
  const bgMain       = isDark ? '#121212' : '#FFFFFF';
  const bgSidebar    = isDark ? '#1E1E1E' : '#F4F4F5';
  const textColor    = isDark ? '#FFFFFF' : '#333333';
  const textMuted    = isDark ? '#888888' : '#777777';
  const borderColor  = isDark ? '#333333' : '#E5E7EB';
  const activeColor  = '#90248A';

  const [activeTab,          setActiveTab]          = useState('Category');
  const [searchQuery,        setSearchQuery]         = useState('');
  const [selectedCategories, setSelectedCategories]  = useState([]);
  const [selectedGender,     setSelectedGender]      = useState('');
  const [selectedPrice,      setSelectedPrice]       = useState(null);
  const [selectedRating,     setSelectedRating]      = useState(null);
  const [selectedDiscount,   setSelectedDiscount]    = useState(null);

  useEffect(() => {
    if (visible) {
      setSelectedCategories(currentFilters?.categories || []);
      setSelectedGender(currentFilters?.gender || '');
      setSelectedPrice(currentFilters?.price || null);
      setSelectedRating(currentFilters?.rating || null);
      setSelectedDiscount(currentFilters?.discount || null);
      setActiveTab('Category');
      setSearchQuery('');
    }
  }, [visible, currentFilters]);

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedGender('');
    setSelectedPrice(null);
    setSelectedRating(null);
    setSelectedDiscount(null);
  };

  const applyFilters = () => {
    onApply({
      categories:  selectedCategories,
      gender:      selectedGender,
      price:       selectedPrice,
      rating:      selectedRating,
      discount:    selectedDiscount,
    });
  };

  const toggleCategory = (slug) =>
    setSelectedCategories(prev =>
      prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]
    );

  const renderCheckbox = (isSelected) => (
    <View style={[styles.checkbox, { borderColor: isSelected ? activeColor : textMuted }, isSelected && { backgroundColor: activeColor }]}>
      {isSelected && <Text style={styles.checkmark}>✓</Text>}
    </View>
  );

  const renderRadio = (isSelected) => (
    <View style={[styles.radio, { borderColor: isSelected ? activeColor : textMuted }]}>
      {isSelected && <View style={[styles.radioDot, { backgroundColor: activeColor }]} />}
    </View>
  );

  const displayCategories = categories.filter(c => {
    const name = c.name || c.slug || (typeof c === 'string' ? c : '');
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Count active filters for badge
  const activeCount = [
    selectedCategories.length > 0,
    !!selectedGender,
    !!selectedPrice,
    !!selectedRating,
    !!selectedDiscount,
  ].filter(Boolean).length;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[styles.container, { backgroundColor: bgMain }]}>

        {/* HEADER */}
        <View style={[styles.header, { borderBottomColor: borderColor }]}>
          <View style={styles.headerLeft}>
            <Text style={[styles.headerTitle, { color: textColor }]}>FILTERS</Text>
            {activeCount > 0 && (
              <View style={[styles.activeBadge, { backgroundColor: activeColor }]}>
                <Text style={styles.activeBadgeText}>{activeCount}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={[styles.closeIcon, { color: textColor }]}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* SPLIT VIEW */}
        <View style={styles.content}>

          {/* Left Sidebar */}
          <View style={[styles.sidebar, { backgroundColor: bgSidebar, borderRightColor: borderColor }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    style={[styles.tabItem, isActive && [styles.tabActive, { backgroundColor: bgMain, borderLeftColor: activeColor }]]}
                    onPress={() => setActiveTab(tab)}
                  >
                    <Text style={[styles.tabText, { color: isActive ? activeColor : textMuted, fontWeight: isActive ? '700' : '500' }]}>
                      {tab}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Right Panel */}
          <View style={[styles.rightPanel, { backgroundColor: bgMain }]}>
            {activeTab === 'Category' && (
              <View style={[styles.searchBox, { borderColor, backgroundColor: isDark ? '#2A2A2A' : '#F9F9F9' }]}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={[styles.searchInput, { color: textColor }]}
                  placeholder="Search categories..."
                  placeholderTextColor={textMuted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            )}

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

              {/* CATEGORY */}
              {activeTab === 'Category' && displayCategories.map((item, index) => {
                const slug  = item.slug ?? item.name?.toLowerCase() ?? item;
                const label = item.name ?? (typeof item === 'string' ? item.replace(/-/g, ' ') : slug);
                const isSelected = selectedCategories.includes(slug);
                return (
                  <TouchableOpacity key={index} style={styles.optionRow} onPress={() => toggleCategory(slug)}>
                    {renderCheckbox(isSelected)}
                    <Text style={[styles.optionText, { color: textColor }]} numberOfLines={2}>{label}</Text>
                  </TouchableOpacity>
                );
              })}

              {/* GENDER */}
              {activeTab === 'Gender' && GENDERS.map((gender, index) => {
                const isSelected = selectedGender === gender;
                return (
                  <TouchableOpacity key={index} style={styles.optionRow} onPress={() => setSelectedGender(isSelected ? '' : gender)}>
                    {renderRadio(isSelected)}
                    <Text style={[styles.optionText, { color: textColor }]}>{gender}</Text>
                  </TouchableOpacity>
                );
              })}

              {/* PRICE — INR ranges */}
              {activeTab === 'Price' && PRICES.map((price, index) => {
                const isSelected = selectedPrice?.label === price.label;
                return (
                  <TouchableOpacity key={index} style={styles.optionRow} onPress={() => setSelectedPrice(isSelected ? null : price)}>
                    {renderRadio(isSelected)}
                    <Text style={[styles.optionText, { color: textColor }]}>{price.label}</Text>
                  </TouchableOpacity>
                );
              })}

              {/* RATING */}
              {activeTab === 'Rating' && RATINGS.map((rating, index) => {
                const isSelected = selectedRating === rating.val;
                return (
                  <TouchableOpacity key={index} style={styles.optionRow} onPress={() => setSelectedRating(isSelected ? null : rating.val)}>
                    {renderRadio(isSelected)}
                    <Text style={[styles.optionText, { color: textColor }]}>{rating.label}</Text>
                  </TouchableOpacity>
                );
              })}

              {/* DISCOUNT */}
              {activeTab === 'Discount' && DISCOUNTS.map((discount, index) => {
                const isSelected = selectedDiscount === discount.val;
                return (
                  <TouchableOpacity key={index} style={styles.optionRow} onPress={() => setSelectedDiscount(isSelected ? null : discount.val)}>
                    {renderRadio(isSelected)}
                    <Text style={[styles.optionText, { color: textColor }]}>{discount.label}</Text>
                  </TouchableOpacity>
                );
              })}

            </ScrollView>
          </View>
        </View>

        {/* FOOTER */}
        <View style={[styles.footer, { borderTopColor: borderColor, backgroundColor: bgMain }]}>
          <TouchableOpacity style={styles.clearBtn} onPress={clearAll}>
            <Text style={[styles.clearText, { color: textColor }]}>CLEAR ALL</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.applyBtn, { backgroundColor: activeColor }]} onPress={applyFilters}>
            <Text style={styles.applyText}>Done</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1 },
  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  headerLeft:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle:  { fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },
  activeBadge:  { borderRadius: 10, minWidth: 20, height: 20, paddingHorizontal: 6, justifyContent: 'center', alignItems: 'center' },
  activeBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  closeBtn:     { padding: 4 },
  closeIcon:    { fontSize: 20, fontWeight: 'bold' },

  content:      { flex: 1, flexDirection: 'row' },
  sidebar:      { width: 120, borderRightWidth: 1 },
  tabItem:      { paddingVertical: 18, paddingHorizontal: 12, borderLeftWidth: 4, borderLeftColor: 'transparent' },
  tabActive:    { elevation: 2, shadowColor: '#000', shadowOffset: { width: 1, height: 0 }, shadowOpacity: 0.05, shadowRadius: 2 },
  tabText:      { fontSize: 14, textTransform: 'capitalize' },

  rightPanel:   { flex: 1 },
  searchBox:    { flexDirection: 'row', alignItems: 'center', margin: 12, paddingHorizontal: 10, height: 40, borderWidth: 1, borderRadius: 8 },
  searchIcon:   { marginRight: 8, fontSize: 16 },
  searchInput:  { flex: 1, fontSize: 14 },
  scrollContent:{ padding: 12, paddingBottom: 40 },

  optionRow:    { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  optionText:   { fontSize: 15, textTransform: 'capitalize' },

  checkbox:     { width: 20, height: 20, borderWidth: 1.5, borderRadius: 4, marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  checkmark:    { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  radio:        { width: 20, height: 20, borderWidth: 1.5, borderRadius: 10, marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  radioDot:     { width: 10, height: 10, borderRadius: 5 },

  footer:       { flexDirection: 'row', padding: 16, borderTopWidth: 1, alignItems: 'center', justifyContent: 'space-between' },
  clearBtn:     { flex: 1, alignItems: 'center', paddingVertical: 12 },
  clearText:    { fontSize: 14, fontWeight: '600' },
  applyBtn:     { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 8, marginLeft: 16 },
  applyText:    { color: '#FFF', fontSize: 16, fontWeight: '700' },
});