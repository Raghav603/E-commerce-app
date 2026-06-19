import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  Text, 
  RefreshControl, 
  TouchableOpacity, 
  SafeAreaView,
  useColorScheme,
  BackHandler
} from 'react-native';
import Header from './components/header';
import Product from './components/product';
import Footer from './components/footer';
import Search from './components/search';
import Profile from './components/profile';

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [theme, setTheme] = useState('system'); // 'light', 'dark', 'system'
  const [stack, setStack] = useState(['Home']);

  const colorScheme = useColorScheme();
  const currentTheme = theme === 'system' ? colorScheme : theme;

  const flatListRef = useRef(null);
  const categoryListRef = useRef(null);
  const profileScrollRef = useRef(null);
  const LIMIT = 10;

  const activeTab = stack[stack.length - 1];

  const getAPIData = async (isRefresh = false) => {
    if (!isRefresh && !hasMore) return;
    
    setError(null); 

    try {
      if (isRefresh) setRefreshing(true);
      else if (page > 0) setLoadingMore(true);

      const response = await fetch(`https://dummyjson.com/products?limit=${LIMIT}&skip=${isRefresh ? 0 : page}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const data = await response.json();
      const mappedProducts = data.products.map(p => ({
        id: p.id,
        name: p.title,
        price: `$${p.price}`,
        image: p.thumbnail,
      }));

      setProducts(isRefresh ? mappedProducts : prev => [...prev, ...mappedProducts]);
      setPage(isRefresh ? LIMIT : prev => prev + LIMIT);
      setHasMore(data.products.length === LIMIT);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => { getAPIData(); }, []);

  const popScreen = () => {
    setStack(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  useEffect(() => {
    const backAction = () => {
      if (stack.length > 1) {
        popScreen();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [stack]);

  const scrollToTop = (ref) => {
    if (ref?.current?.scrollToOffset) {
      ref.current.scrollToOffset({ offset: 0, animated: true });
    } else if (ref?.current?.scrollTo) {
      ref.current.scrollTo({ y: 0, animated: true });
    }
  };

  const handleTabPress = (tabName, ref) => {
    if (activeTab === tabName) {
      scrollToTop(ref);
    } else {
      if (tabName === 'Home') {
        setStack(['Home']);
      } else {
        setStack(['Home', tabName]);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#5DB075" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme === 'dark' ? '#000' : '#F7F8FA' }]}>
      <Header 
        activeTab={activeTab} 
        onProfilePress={() => handleTabPress('Profile', profileScrollRef)} 
        theme={currentTheme} 
        showBack={stack.length > 1}
        onBackPress={popScreen}
      />
      {activeTab === 'Category' ? (
        <Search theme={currentTheme} listRef={categoryListRef} />
      ) : activeTab === 'MyOrder' ? (
        <View style={styles.centered}>
          <Text style={{ color: currentTheme === 'dark' ? '#fff' : '#1A1A1A', fontSize: 18, fontWeight: 'bold' }}>My Orders</Text>
        </View>
      ) : activeTab === 'Profile' ? (
        <Profile theme={currentTheme} themePref={theme} setTheme={setTheme} scrollRef={profileScrollRef} />
      ) : error ? (
        <View style={[styles.centered, { backgroundColor: currentTheme === 'dark' ? '#000' : '#F7F8FA' }]}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          numColumns={2}
          ref={flatListRef}
          data={products}
          keyExtractor={(item) => String(item.id)}
          renderItem={({item}) => (
            <View style={styles.gridItem}>
              <Product item={item} theme={currentTheme} />
            </View>
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={() => getAPIData(true)} 
              tintColor="#5DB075" 
            />
          }
          onEndReached={() => !loadingMore && hasMore && getAPIData()}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loadingMore ? <ActivityIndicator style={styles.loader} size="small" color="#5DB075" /> : null}
          onScroll={(e) => setShowScrollTop(e.nativeEvent.contentOffset.y > 500)}
        />
      )}

      {showScrollTop && activeTab === 'Home' && (
        <TouchableOpacity style={styles.topButton} onPress={() => scrollToTop(flatListRef)}>
          <Text style={styles.buttonText}>↑</Text>
        </TouchableOpacity>
      )}
      <Footer
        activeTab={activeTab}
        theme={currentTheme}
        onHomePress={() => handleTabPress('Home', flatListRef)}
        onCategoryPress={() => handleTabPress('Category', categoryListRef)}
        onMyOrderPress={() => handleTabPress('MyOrder', null)}
        onProfilePress={() => handleTabPress('Profile', profileScrollRef)}
      />
    </SafeAreaView>   
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: 10, paddingBottom: 100 },
  cardContainer: {
    marginVertical: 8,
    backgroundColor: '#0000',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gridItem: {
  flex: 1,
  margin: 8,
  },
  errorText: { color: '#B00020', fontSize: 16, fontWeight: '500' },
  loader: { paddingVertical: 20 },
  topButton: {
    position: 'absolute',
    bottom: 80, 
    right: 20,
    backgroundColor: 'green',
    width: 56,
    height: 56,
    borderRadius: 28, 
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  }, 
  buttonText: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' }
});

export default App;
