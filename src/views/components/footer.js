import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Footer = ({ activeTab, theme, onHomePress, onCategoryPress, onMyOrderPress, onProfilePress, onBackPressFromFooter }) => {

  const colors = {
    light: { background: '#fff', text: '#1A1A1A', border: '#E5E5E5', active: '#5DB075' },
    dark: { background: '#121212', text: '#fff', border: '#272727', active: '#5DB075' }
  };
  const themeColors = theme === 'dark' ? colors.dark : colors.light;

  return (
    <View style={[styles.footerContainer, { backgroundColor: themeColors.background, borderTopColor: themeColors.border }]}>
      <TouchableOpacity style={styles.tabBtn} onPress={onHomePress}>
        <Ionicons 
          name={activeTab === 'Home' ? "home" : "home-outline"} 
          size={24} 
          color={activeTab === 'Home' ? themeColors.active : themeColors.text} 
        />
        <Text style={[styles.tabText, { color: themeColors.text }, activeTab === 'Home' && { color: themeColors.active }]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabBtn} onPress={onCategoryPress}>
        <Ionicons 
          name={activeTab === 'Category' ? "search" : "search-outline"} 
          size={24} 
          color={activeTab === 'Category' ? themeColors.active : themeColors.text} 
        />
        <Text style={[styles.tabText, { color: themeColors.text }, activeTab === 'Category' && { color: themeColors.active }]}>Category</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabBtn} onPress={onMyOrderPress}>
        <Ionicons 
          name={activeTab === 'MyOrder' ? "cube" : "cube-outline"} 
          size={24} 
          color={activeTab === 'MyOrder' ? themeColors.active : themeColors.text} 
        />
        <Text style={[styles.tabText, { color: themeColors.text }, activeTab === 'MyOrder' && { color: themeColors.active }]}>My Order</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabBtn} onPress={onProfilePress}>
        <Ionicons 
          name={activeTab === 'Profile' ? "person" : "person-outline"} 
          size={24} 
          color={activeTab === 'Profile' ? themeColors.active : themeColors.text} 
        />
        <Text style={[styles.tabText, { color: themeColors.text }, activeTab === 'Profile' && { color: themeColors.active }]}>Profile</Text>
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
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});

export default Footer;