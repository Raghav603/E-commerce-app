import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Profile from '../components/profile';
import { ThemeContext } from './AppNavigator';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { themePref, resolvedTheme, setTheme } = useContext(ThemeContext);

  useEffect(() => {
    const onBackPress = () => {
      if (navigation.canGoBack()) { navigation.goBack(); return true; }
      navigation.reset({ index: 0, routes: [{ name: 'HomeTabs' }] });
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: resolvedTheme === 'dark' ? '#000' : '#F7F8FA' }]}>
      <Profile
        theme={resolvedTheme}
        themePref={themePref}
        setTheme={setTheme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});