import React, { useState, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './HomeScreen';
import CategoryScreen from './CategoryScreen';
import WishlistScreen from './WishlistScreen';
import WishlistSearchScreen from './WishlistSearchScreen';
import CartScreen from './CartScreen';
import MyOrderScreen from './MyOrderScreen';
import ProfileScreen from './ProfileScreen';

import Header from '../components/header';
import Footer from '../components/footer';

// ─── Global theme context ────────────────────────────────────────────────────
export const ThemeContext = React.createContext({
  themePref: 'system',
  resolvedTheme: 'light',
  setTheme: () => {},
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ─── Header wrapper ──────────────────────────────────────────────────────────
const HeaderWrapper = ({ navigation, resolvedTheme, activeTab }) => (
  <Header
      activeTab={activeTab}
      theme={resolvedTheme}
      showBack={navigation.canGoBack()}
      onBackPress={() => {
        if (navigation.canGoBack()) navigation.goBack();
      }}
      onProfilePress={() => navigation.navigate('Profile')}
      onWishlistPress={() => navigation.navigate('Wishlist')}
      onCartPress={() => navigation.navigate('Cart')}
      onWishlistSearchPress={() => navigation.navigate('WishlistSearch')}
    />
);

// ─── Footer (tab bar) ────────────────────────────────────────────────────────
const TabBar = ({ state, navigation, resolvedTheme }) => {
  const activeRouteMap = { Home: 'Home', Category: 'Category', MyOrder: 'MyOrder', Profile: 'Profile' };
  const activeTab = activeRouteMap[state?.routes?.[state.index]?.name] ?? 'Home';

  return (
    <Footer
      activeTab={activeTab}
      theme={resolvedTheme}
      onHomePress={() => navigation.navigate('Home')}
      onCategoryPress={() => navigation.navigate('Category')}
      onMyOrderPress={() => navigation.navigate('MyOrder')}
      onProfilePress={() => navigation.navigate('Profile')}
    />
  );
};

// ─── Bottom tab stack ────────────────────────────────────────────────────────
function HomeTabsStack({ resolvedTheme }) {
  // We pass resolvedTheme down so each tab screen can use it directly.
  const screenProps = { resolvedTheme };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} resolvedTheme={resolvedTheme} />}
    >
      <Tab.Screen name="Home"     component={HomeScreen}     initialParams={screenProps} />
      <Tab.Screen name="Category" component={CategoryScreen} initialParams={screenProps} />
      <Tab.Screen name="MyOrder"  component={MyOrderScreen}  initialParams={screenProps} />
      <Tab.Screen name="Profile"  component={ProfileScreen}  initialParams={screenProps} />
    </Tab.Navigator>
  );
}

// ─── Root navigator ──────────────────────────────────────────────────────────
export default function AppNavigator() {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [themePref, setThemePref] = useState('system'); // 'light' | 'dark' | 'system'

  const resolvedTheme = themePref === 'system' ? (systemScheme ?? 'light') : themePref;

  const setTheme = useCallback((pref) => setThemePref(pref), []);

  // HomeTabsStack needs resolvedTheme but React Navigation doesn't easily pass
  // non-serialisable values as params, so we wrap it in a closure.
  const HomeTabsComponent = useCallback(
    () => <HomeTabsStack resolvedTheme={resolvedTheme} />,
    [resolvedTheme],
  );

  return (
    <ThemeContext.Provider value={{ themePref, resolvedTheme, setTheme }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="HomeTabs"
          screenOptions={({ navigation, route }) => {
            let activeTab = route.name;
            if (route.name === 'HomeTabs') activeTab = 'Home';

            return {
              headerShown: true,
              header: () => (
                <HeaderWrapper
                  navigation={navigation}
                  resolvedTheme={resolvedTheme}
                  activeTab={activeTab}
                />
              ),
            };
          }}
        >
          <Stack.Screen name="HomeTabs"       component={HomeTabsComponent}    options={{ headerShown: true }} />
          <Stack.Screen name="Wishlist"        component={WishlistScreen} />
          <Stack.Screen name="WishlistSearch"  component={WishlistSearchScreen} />
          <Stack.Screen name="Cart"            component={CartScreen} />
          <Stack.Screen name="Profile"         component={ProfileScreen} />
          <Stack.Screen name="MyOrder"         component={MyOrderScreen} />
          <Stack.Screen name="Category"        component={CategoryScreen} />
          <Stack.Screen name="Home"            component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}