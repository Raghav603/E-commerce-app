import React, { useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import {useSelector} from 'react-redux';

const Header = ({ activeTab, onProfilePress, theme, showBack, onBackPress }) => {
  const cartData = useSelector(state => state.Reducer);
  const [searchQuery, setSearchQuery] = useState('');

  const colors = {
    light: { background: '#F7F8FA', text: '#1A1A1A', secondaryText: '#777', searchBg: '#FFFFFF', border: '#E5E5E5' },
    dark: { background: '#000', text: '#fff', secondaryText: '#A9A9A9', searchBg: '#1A1A1A', border: '#333' }
  };
  const themeColors = theme === 'dark' ? colors.dark : colors.light;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.topRow}>
        <View style={styles.userInfoContainer}>
          {showBack && (
            <TouchableOpacity style={styles.backBtn} onPress={onBackPress}>
              <Text style={[styles.iconText, { color: themeColors.text }]}>←</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.profileIconContainer} onPress={onProfilePress}>
            <Text style={[styles.iconText, { color: themeColors.text }]}>👤</Text>
          </TouchableOpacity>
          <View>
            <Text style={[styles.helloText, { color: themeColors.secondaryText }]}>Hello</Text>
            <Text style={[styles.phoneText, { color: themeColors.text }]}>+91 1234567890</Text>
          </View>
        </View>

        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Text style={[styles.iconText, { color: themeColors.text }]}>🔔</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cartContainer}>
            <Text style={[styles.iconText, { color: themeColors.text }]}>🛒</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartData.length}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'Home' && (
        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.searchInput, { backgroundColor: themeColors.searchBg, color: themeColors.text, borderColor: themeColors.border }]}
            placeholder="Search products..."
            placeholderTextColor={themeColors.secondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
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
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 4,
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
    marginTop: 15,
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