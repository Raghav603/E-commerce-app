import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useSelector } from 'react-redux';

const Header = ({
  activeTab,
  onProfilePress,
  theme,
  showBack,
  onBackPress,
  onWishlistPress,
  onCartPress,
  onWishlistSearchPress,
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartData = useSelector(state => state.Reducer);

  const resolvedActiveTab = activeTab;
  const resolvedShowBack  = showBack;

  const handleBackPress          = () => { if (onBackPress)          onBackPress(); };
  const handleProfilePress       = () => { if (onProfilePress)       onProfilePress(); };
  const handleWishlistPress      = () => { if (onWishlistPress)      onWishlistPress(); };
  const handleWishlistSearchPress = () => { if (onWishlistSearchPress) onWishlistSearchPress(); };
  const handleCartPress          = () => { if (onCartPress)          onCartPress(); };

  const handleSearchToggle = () => {
    setIsSearching(prev => !prev);
    setSearchQuery('');
    // Also call the external toggle so Wishlist component shows its search bar
    handleWishlistSearchPress();
  };

  const colors = {
    light: { background: '#F7F8FA', text: '#1A1A1A', secondaryText: '#777', searchBg: '#FFFFFF', border: '#E5E5E5' },
    dark:  { background: '#000',    text: '#fff',    secondaryText: '#A9A9A9', searchBg: '#1A1A1A', border: '#333' },
  };
  const themeResolved = theme === 'system' ? 'light' : theme;
  const themeColors   = themeResolved === 'dark' ? colors.dark : colors.light;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>

      {/* ── CATEGORY ─────────────────────────────────────────────────────── */}
      {resolvedActiveTab === 'Category' || resolvedActiveTab === 'CategoryTab' ? (
        <View style={styles.topRow}>
          <View style={styles.userInfoContainer}>
            {resolvedShowBack && (
              <TouchableOpacity style={styles.backBtn} onPress={handleBackPress}>
                <Text style={[styles.iconText, { color: themeColors.text }]}>❮</Text>
              </TouchableOpacity>
            )}
            <Text style={[styles.categoryTitle, { color: themeColors.text }]}>CATEGORIES</Text>
          </View>
          <View style={styles.rightIcons}>
            <TouchableOpacity style={styles.iconBtn}>
              <Text style={[styles.iconText, { color: themeColors.text }]}>🔍︎</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={handleWishlistPress}>
              <Text style={[styles.iconText, { color: themeColors.text }]}>❤️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cartContainer} onPress={handleCartPress}>
              <Text style={[styles.iconText, { color: themeColors.text }]}>🛒</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartData.length}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

      /* ── WISHLIST ─────────────────────────────────────────────────────── */
      ) : resolvedActiveTab === 'Wishlist' ? (
        <>
          <View style={styles.topRow}>
            <View style={styles.userInfoContainer}>
              {resolvedShowBack && (
                <TouchableOpacity style={styles.backBtn} onPress={handleBackPress}>
                  <Text style={[styles.iconText, { color: themeColors.text }]}>❮</Text>
                </TouchableOpacity>
              )}
              {/* When searching, show a back-arrow to close the search bar */}
              {isSearching ? (
                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={() => { setIsSearching(false); setSearchQuery(''); handleWishlistSearchPress(); }}
                >
                  {/* <Text style={[styles.iconText, { color: themeColors.text }]}>✕</Text> */}
                </TouchableOpacity>
              ) : (
                <Text style={[styles.title, { color: themeColors.text }]}>My Products</Text>
              )}
            </View>

            <View style={styles.rightIcons}>
              {/* Toggle search icon — active state shown in teal */}
              <TouchableOpacity style={styles.iconBtn} onPress={handleSearchToggle}>
                <Text style={[styles.iconText, { color: isSearching ? '#5DB075' : themeColors.text }]}>
                  🔍︎  
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cartContainer} onPress={handleCartPress}>
                <Text style={[styles.iconText, { color: themeColors.text }]}>🛒</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartData.length}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Inline search bar — slides in below the title row */}
          {isSearching && (
            <View style={[styles.searchContainer, { borderTopColor: themeColors.border }]}>
              <TextInput
                style={[
                  styles.searchInput,
                  { backgroundColor: themeColors.searchBg, color: themeColors.text, borderColor: themeColors.border },
                ]}
                placeholder="Search your wishlist..."
                placeholderTextColor={themeColors.secondaryText}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                returnKeyType="search"
              />
            </View>
          )}
        </>

      /* ── CART ────────────────────────────────────────────────────────── */
      ) : resolvedActiveTab === 'Cart' ? (
        <View style={styles.topRow}>
          <View style={styles.userInfoContainer}>
            {resolvedShowBack && (
              <TouchableOpacity style={styles.backBtn} onPress={handleBackPress}>
                <Text style={[styles.iconText, { color: themeColors.text }]}>❮</Text>
              </TouchableOpacity>
            )}
            <Text style={[styles.title, { color: themeColors.text }]}>Cart</Text>
          </View>
        </View>

      /* ── DEFAULT (Home / Profile / MyOrder / CategoryDetail) ─────────── */
      ) : (
        <View style={styles.topRow}>
          <View style={styles.userInfoContainer}>
            {resolvedShowBack && (
              <TouchableOpacity style={styles.backBtn} onPress={handleBackPress}>
                <Text style={[styles.iconText, { color: themeColors.text }]}>❮</Text>
              </TouchableOpacity>
            )}
            {/* If activeTab is a custom string (CategoryDetail name) show it as title */}
            {resolvedActiveTab !== 'Home' && resolvedActiveTab !== 'MyOrder' && resolvedActiveTab !== 'Profile' ? (
              <Text style={[styles.title, { color: themeColors.text, textTransform: 'capitalize' }]} numberOfLines={1}>
                {resolvedActiveTab}
              </Text>
            ) : (
              <>
                <TouchableOpacity style={styles.profileIconContainer} onPress={handleProfilePress}>
                  <Text style={[styles.iconText, { color: themeColors.text }]}>👤</Text>
                </TouchableOpacity>
                <View>
                  <Text style={[styles.helloText, { color: themeColors.secondaryText }]}>Hello</Text>
                  <Text style={[styles.phoneText, { color: themeColors.text }]}>+91 1234567890</Text>
                </View>
              </>
            )}
          </View>

          <View style={styles.rightIcons}>
            {resolvedActiveTab === 'Home' && (
              <TouchableOpacity style={styles.iconBtn}>
                <Text style={[styles.iconText, { color: themeColors.text }]}>🔔</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.iconBtn} onPress={handleWishlistPress}>
              <Text style={[styles.iconText, { color: themeColors.text }]}>❤️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cartContainer} onPress={handleCartPress}>
              <Text style={[styles.iconText, { color: themeColors.text }]}>🛒</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartData.length}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 4,
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 22,
  },
  cartContainer: {
    marginLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: '#5DB075',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
  },
  searchContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    paddingTop: 10,
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  backBtn: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileIconContainer: {
    marginRight: 12,
  },
  helloText: {
    fontSize: 14,
  },
  phoneText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Header;  