import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const Profile = ({ theme, themePref, setTheme, scrollRef }) => {
  const [showThemeOptions, setShowThemeOptions] = useState(false);

  const colors = {
    light: { background: '#F7F8FA', text: '#1A1A1A', card: '#fff', border: '#E5E5E5', chevron: '#ccc', logout: '#B00020', secondaryText: '#777', avatarBg: '#EEF8F0' },
    dark: { background: '#000', text: '#fff', card: '#121212', border: '#272727', chevron: '#555', logout: '#CF6679', secondaryText: '#A9A9A9', avatarBg: '#222' }
  };
  const themeColors = theme === 'dark' ? colors.dark : colors.light;
  const styles = getStyles(themeColors);

  return (
    <ScrollView ref={scrollRef} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.email}>johndoe@example.com</Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Edit Profile</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Order History</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Settings</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => setShowThemeOptions(!showThemeOptions)}>
          <Text style={styles.optionText}>Theme</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        {showThemeOptions && (
          <View style={styles.themeOptionsContainer}>
            <TouchableOpacity style={styles.themeOption} onPress={() => { setTheme('light'); setShowThemeOptions(false); }}>
              <Text style={[styles.optionText, themePref === 'light' && styles.activeTheme]}>Light</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.themeOption} onPress={() => { setTheme('dark'); setShowThemeOptions(false); }}>
              <Text style={[styles.optionText, themePref === 'dark' && styles.activeTheme]}>Dark</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.themeOption} onPress={() => { setTheme('system'); setShowThemeOptions(false); }}>
              <Text style={[styles.optionText, themePref === 'system' && styles.activeTheme]}>System</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity style={[styles.option, styles.logoutOption]}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.avatarBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  email: {
    fontSize: 14,
    color: colors.secondaryText,
    marginTop: 4,
  },
  section: {
    marginTop: 20,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
  },
  chevron: {
    fontSize: 24,
    color: colors.chevron,
  },
  logoutOption: {
    borderBottomWidth: 0,
  },
  logoutText: {
    fontSize: 16,
    color: colors.logout,
    fontWeight: 'bold',
  },
  themeOptionsContainer: {
    paddingLeft: 40,
    backgroundColor: colors.background,
  },
  themeOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activeTheme: {
    color: '#5DB075',
    fontWeight: 'bold',
  },
});

export default Profile;