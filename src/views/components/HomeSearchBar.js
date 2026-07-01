import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const HomeSearchBar = ({ theme }) => {
  const navigation = useNavigation();
  const isDark = theme === 'dark';
  const colors = {
    searchBg: isDark ? '#1A1A1A' : '#FFFFFF',
    border: isDark ? '#333' : '#E5E5E5',
    secondaryText: isDark ? '#A9A9A9' : '#777',
    text: isDark ? '#fff' : '#1A1A1A',
  };

  return (
    <TouchableOpacity
      style={[styles.homeSearchBar, { backgroundColor: colors.searchBg, borderColor: colors.border }]}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('Search')}
    >
      <Ionicons name="search" size={20} color={colors.secondaryText} style={{ marginRight: 10 }} />
      <Text style={{ color: colors.secondaryText, flex: 1 }}>Search for products...</Text>
      <Ionicons name="scan-outline" size={20} color={colors.text} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  homeSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    margin: 16,
  },
});

export default HomeSearchBar;