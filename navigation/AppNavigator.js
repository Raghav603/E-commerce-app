import React, { useState, useCallback, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './HomeScreen';
import CategoryScreen from './CategoryScreen';
import CategoryDetailScreen from './CategoryDetailScreen';
import WishlistScreen from './WishlistScreen';
import WishlistSearchScreen from './WishlistSearchScreen';
import CartScreen from './CartScreen';
import MyOrderScreen from './MyOrderScreen';
import ProfileScreen from './ProfileScreen';

import Header from '../components/header';
import Footer from '../components/footer';

// ─── Global theme context ─────────────────────────────────────────────────────
export const ThemeContext = React.createContext({
  themePref: 'system',
  resolvedTheme: 'light',
  setTheme: () => {},
});

// ─── Shared ref so the header 🔍 button can toggle the search bar
//     inside WishlistScreen without any navigation ───────────────────────────
export const WishlistSearchRef = React.createRef();

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

// ─── Header wrapper ───────────────────────────────────────────────────────────
const HeaderWrapper = ({ navigation, activeTab }) => {
  const { resolvedTheme } = useContext(ThemeContext);
  return (
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
      onWishlistSearchPress={() => {
        // Toggle the search bar inside WishlistScreen directly — no navigation
        if (WishlistSearchRef.current) WishlistSearchRef.current();
      }}
    />
  );
};

// ─── Footer (tab bar) ─────────────────────────────────────────────────────────
const TabBar = ({ state, navigation }) => {
  const { resolvedTheme } = useContext(ThemeContext);
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

// ─── Bottom tab stack — stable component, reads theme from context ────────────
// NOT wrapped in useCallback — stable reference prevents tab remounting on theme change
function HomeTabsStack() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen name="Home"     component={HomeScreen} />
      <Tab.Screen name="Category" component={CategoryScreen} />
      <Tab.Screen name="MyOrder"  component={MyOrderScreen} />
      <Tab.Screen name="Profile"  component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ─── Root navigator ───────────────────────────────────────────────────────────
export default function AppNavigator() {
  const systemScheme = useColorScheme();
  const [themePref, setThemePref] = useState('system');

  const resolvedTheme = themePref === 'system' ? (systemScheme ?? 'light') : themePref;
  const setTheme = useCallback((pref) => setThemePref(pref), []);

  return (
    <ThemeContext.Provider value={{ themePref, resolvedTheme, setTheme }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="HomeTabs"
          screenOptions={({ navigation, route }) => {
            let activeTab = route.name;
            if (route.name === 'HomeTabs') activeTab = 'Home';
            if (route.name === 'CategoryDetail') activeTab = route.params?.categoryName ?? 'Category';

            return {
              headerShown: true,
              header: () => (
                <HeaderWrapper
                  navigation={navigation}
                  activeTab={activeTab}
                />
              ),
            };
          }}
        >
          <Stack.Screen name="HomeTabs"      component={HomeTabsStack}       options={{ headerShown: true }} />
          <Stack.Screen name="Wishlist"       component={WishlistScreen} />
          <Stack.Screen name="WishlistSearch" component={WishlistSearchScreen} />
          <Stack.Screen name="Cart"           component={CartScreen} />
          <Stack.Screen name="Profile"        component={ProfileScreen} />
          <Stack.Screen name="MyOrder"        component={MyOrderScreen} />
          <Stack.Screen name="Category"       component={CategoryScreen} />
          <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home"           component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}