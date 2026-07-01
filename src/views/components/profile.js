import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import your ViewModel
import { useProfileViewModel } from '../../viewmodels/useProfileViewModel';

const Profile = ({ theme, themePref, setTheme, scrollRef }) => {
  const [showThemeOptions, setShowThemeOptions] = useState(false);
  const navigation = useNavigation();
  
  // Bind the ViewModel to get the live, updated profile data
  const { profileData } = useProfileViewModel();

  const colors = {
    light: { background: '#F7F8FA', text: '#1A1A1A', card: '#fff', border: '#E5E5E5', chevron: '#ccc', logout: '#B00020', secondaryText: '#777', avatarBg: '#EEF8F0', primary: '#5DB075' },
    dark: { background: '#000', text: '#fff', card: '#121212', border: '#272727', chevron: '#555', logout: '#CF6679', secondaryText: '#A9A9A9', avatarBg: '#1A2E22', primary: '#5DB075' }
  };
  const themeColors = theme === 'dark' ? colors.dark : colors.light;

  const handleThemeChange = async (newTheme) => {
    setTheme(newTheme);
    setShowThemeOptions(false);
    try {
      await AsyncStorage.setItem('user_theme_preference', newTheme);
    } catch (e) {
      console.log("Error saving theme:", e);
    }
  };

  return (
    <ScrollView ref={scrollRef} style={[styles.container, { backgroundColor: themeColors.background }]}>
      
      {/* ── HEADER & USER INFO ── */}
      <View style={[styles.header, { backgroundColor: themeColors.card, borderBottomColor: themeColors.border }]}>
        <View style={[styles.avatarContainer, { backgroundColor: themeColors.avatarBg }]}>
          {profileData.avatarUri ? (
            <Image source={{ uri: profileData.avatarUri }} style={styles.avatarImage} />
          ) : (
            <Ionicons name="person" size={40} color={themeColors.primary} />
          )}
        </View>
        {/* Dynamic Data rendered here */}
        <Text style={[styles.name, { color: themeColors.text }]}>{profileData.name || 'John Doe'}</Text>
        <Text style={[styles.email, { color: themeColors.secondaryText }]}>{profileData.email || 'johndoe@example.com'}</Text>
        <Text style={[styles.email, { color: themeColors.secondaryText }]}>{profileData.phone || '+91 1234567890'}</Text>
      </View>

      {/* ── MENU SECTIONS ── */}
      <View style={[styles.section, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
        
        <TouchableOpacity 
          style={[styles.option, { borderBottomColor: themeColors.border }]}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={[styles.optionText, { color: themeColors.text }]}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={20} color={themeColors.chevron} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.option, { borderBottomColor: themeColors.border }]}
          onPress={() => navigation.navigate('MyOrder')}
        >
          <Text style={[styles.optionText, { color: themeColors.text }]}>Order History</Text>
          <Ionicons name="chevron-forward" size={20} color={themeColors.chevron} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.option, { borderBottomColor: themeColors.border }]}>
          <Text style={[styles.optionText, { color: themeColors.text }]}>Settings</Text>
          <Ionicons name="chevron-forward" size={20} color={themeColors.chevron} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.option, { borderBottomColor: themeColors.border }]} 
          onPress={() => setShowThemeOptions(!showThemeOptions)}
        >
          <Text style={[styles.optionText, { color: themeColors.text }]}>Theme</Text>
          <Ionicons name={showThemeOptions ? "chevron-down" : "chevron-forward"} size={20} color={themeColors.chevron} />
        </TouchableOpacity>
        
        {/* THEME DROPDOWN */}
        {showThemeOptions && (
          <View style={[styles.themeOptionsContainer, { backgroundColor: themeColors.background }]}>
            <TouchableOpacity style={[styles.themeOption, { borderBottomColor: themeColors.border }]} onPress={() => handleThemeChange('light')}>
              <Text style={[styles.optionText, { color: themeColors.text }, themePref === 'light' && styles.activeTheme]}>Light</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.themeOption, { borderBottomColor: themeColors.border }]} onPress={() => handleThemeChange('dark')}>
              <Text style={[styles.optionText, { color: themeColors.text }, themePref === 'dark' && styles.activeTheme]}>Dark</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.themeOption, { borderBottomColor: themeColors.border }]} onPress={() => handleThemeChange('system')}>
              <Text style={[styles.optionText, { color: themeColors.text }, themePref === 'system' && styles.activeTheme]}>System Default</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <TouchableOpacity style={styles.option}>
          <Text style={[styles.logoutText, { color: themeColors.logout }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: 'center', paddingVertical: 40, borderBottomWidth: 1 },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16, overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%' },
  name: { fontSize: 22, fontWeight: 'bold' },
  email: { fontSize: 14, marginTop: 4 },
  
  section: { marginTop: 20, borderTopWidth: 1, borderBottomWidth: 1 },
  option: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1 },
  optionText: { fontSize: 16 },
  logoutText: { fontSize: 16, fontWeight: 'bold' },
  
  themeOptionsContainer: { paddingLeft: 40 },
  themeOption: { paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1 },
  activeTheme: { color: '#5DB075', fontWeight: 'bold' },
});

export default Profile;