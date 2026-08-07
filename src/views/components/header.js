import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'; //  Vector Icon Import

import { useProfileViewModel } from '../../viewmodels/useProfileViewModel';

const Header = ({
  activeTab,
  onProfilePress,
  theme,
  showBack,
  onBackPress,
  onWishlistPress,
  onCartPress,
}) => {
  const navigation = useNavigation();
  const cartData = useSelector(state => state.Reducer || []);
  const { profileData } = useProfileViewModel();

  const themeColors = theme === 'dark' 
    ? { background: '#000', text: '#fff', secondaryText: '#A9A9A9' }
    : { background: '#F7F8FA', text: '#1A1A1A', secondaryText: '#777' };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.topRow}>
        <View style={styles.userInfoContainer}>
          {showBack && (
            <TouchableOpacity style={styles.backBtn} onPress={onBackPress}>
              <Ionicons name="chevron-back" size={24} color={themeColors.text} />
            </TouchableOpacity>
          )}
          
          {activeTab === 'Home' || activeTab === 'MyOrder' || activeTab === 'Profile' ? (
            <>
              <TouchableOpacity style={styles.avatarCircle} onPress={onProfilePress}>
                {profileData.avatarUri ? (
                  <Image source={{ uri: profileData.avatarUri }} style={styles.avatarImage} />
                ) : (
                  <Ionicons name="person" size={20} color="#fff" />
                )}
              </TouchableOpacity>
              <View>
                <Text style={[styles.helloText, { color: themeColors.secondaryText }]}>Hello,</Text>
                <Text style={[styles.phoneText, { color: themeColors.text }]}>{profileData.phone || '+91 1234567890'}</Text>
              </View>
            </>
          ) : (
            <Text style={[styles.title, { color: themeColors.text }]} numberOfLines={1}>
              {activeTab}
            </Text>
          )}
        </View>

        <View style={styles.rightIcons}>
          {activeTab === 'Home' && (
            <View style={styles.notifContainer}>
              <Ionicons name="notifications-outline" size={24} color={themeColors.text} />
              {/* <View style={[styles.badge, styles.notifBadge]}><Text style={styles.badgeText}>3</Text></View> */}
            </View>
          )}
          <TouchableOpacity style={styles.iconBtn} onPress={onWishlistPress}>
            <Ionicons name="heart-outline" size={24} color={themeColors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartContainer} onPress={onCartPress}>
            <Ionicons name="cart-outline" size={24} color={themeColors.text} />
            {cartData.length > 0 && (
              <View style={styles.badge}><Text style={styles.badgeText}>{cartData.length}</Text></View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
// ... styles remain the same

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 10 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userInfoContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  rightIcons: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { marginLeft: 16 },
  iconText: { fontSize: 22 },
  title: { fontSize: 24, fontWeight: 'bold', flex: 1, textTransform: 'capitalize' },
  backBtn: { marginRight: 12 },
  avatarCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#5DB075', justifyContent: 'center', alignItems: 'center', marginRight: 12, overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%' },
  helloText: { fontSize: 13 },
  phoneText: { fontSize: 16, fontWeight: '700' },
  notifContainer: { position: 'relative' },
  notifBadge: { backgroundColor: '#E53935' },
  cartContainer: { marginLeft: 16, position: 'relative' },
  badge: { position: 'absolute', top: -6, right: -8, backgroundColor: '#5DB075', minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 3, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 10 },
});

export default Header;