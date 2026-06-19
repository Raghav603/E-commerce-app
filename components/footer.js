import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Footer = ({ activeTab, theme, onHomePress, onCategoryPress, onMyOrderPress, onProfilePress }) => {
  const colors = {
    light: { background: '#fff', text: '#1A1A1A', border: '#E5E5E5', active: '#5DB075' },
    dark: { background: '#121212', text: '#fff', border: '#272727', active: '#5DB075' }
  };
  const themeColors = theme === 'dark' ? colors.dark : colors.light;

  return (
    <View style={[styles.footerContainer, { backgroundColor: themeColors.background, borderTopColor: themeColors.border }]}>
      <TouchableOpacity style={styles.tabBtn} onPress={onHomePress}>
        <Text style={[styles.iconText, { color: themeColors.text }]}>🏠</Text>
        <Text style={[styles.tabText, { color: themeColors.text }, activeTab === 'Home' && { color: themeColors.active, fontWeight: 'bold' }]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabBtn} onPress={onCategoryPress}>
        <Text style={[styles.iconText, { color: themeColors.text }]}>🔍</Text>
        <Text style={[styles.tabText, { color: themeColors.text }, activeTab === 'Category' && { color: themeColors.active, fontWeight: 'bold' }]}>Category</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabBtn} onPress={onMyOrderPress}>
        <Text style={[styles.iconText, { color: themeColors.text }]}>📦</Text>
        <Text style={[styles.tabText, { color: themeColors.text }, activeTab === 'MyOrder' && { color: themeColors.active, fontWeight: 'bold' }]}>MyOrder</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabBtn} onPress={onProfilePress}>
        <Text style={[styles.iconText, { color: themeColors.text }]}>👤</Text>
        <Text style={[styles.tabText, { color: themeColors.text }, activeTab === 'Profile' && { color: themeColors.active, fontWeight: 'bold' }]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
  },
  tabBtn: {
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Footer;