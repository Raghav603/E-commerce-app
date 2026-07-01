import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useProfileViewModel = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    avatarUri: null,
  });

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        try {
          const storedProfile = await AsyncStorage.getItem('user_profile_data');
          if (storedProfile) {
            setProfileData(JSON.parse(storedProfile));
          }
        } catch (e) {
          console.error('Failed to load profile data in ViewModel', e);
        }
      };

      loadProfile();
    }, [])
  );

  return { profileData };
};