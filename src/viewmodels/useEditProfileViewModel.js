import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

export const useEditProfileViewModel = (navigation) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUri, setAvatarUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);

  // Load existing profile data when the screen opens
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem('user_profile_data');
        if (storedProfile) {
          const parsed = JSON.parse(storedProfile);
          setName(parsed.name || '');
          setEmail(parsed.email || '');
          setPhone(parsed.phone || '');
          setAvatarUri(parsed.avatarUri || null);
        }
      } catch (e) {
        console.error('Failed to load profile', e);
      }
    };
    loadProfile();
  }, []);

  const handleChoosePhoto = (source) => {
    setShowActionSheet(false); // Close the sheet first
    const options = {
      mediaType: 'photo',
      quality: 0.5,
      saveToPhotos: true,
    };

    const action = source === 'camera' ? launchCamera : launchImageLibrary;

    action(options, (response) => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Something went wrong.');
      }
      if (response.assets && response.assets.length > 0) {
        setAvatarUri(response.assets[0].uri);
      }
    });
  };

  const handleRemovePhoto = () => {
    setAvatarUri(null);
    setShowActionSheet(false);
  };

  const handleSave = async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      const profileData = { name, email, phone, avatarUri };
      await AsyncStorage.setItem('user_profile_data', JSON.stringify(profileData));
      
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      console.error('Failed to save profile', e);
      Alert.alert('Error', 'Could not save profile data.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    phone,
    setPhone,
    avatarUri,
    handleChoosePhoto,
    handleRemovePhoto,
    isLoading,
    handleSave,
    showActionSheet,
    setShowActionSheet,
  };
};