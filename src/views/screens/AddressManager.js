import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, PermissionsAndroid, Platform, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import { ThemeContext } from '../../navigation/AppNavigator';

export default function AddressManager({ navigation }) {
  const { resolvedTheme } = useContext(ThemeContext);
  const isDark = resolvedTheme === 'dark';
  const c = {
    bg: isDark ? '#000' : '#FFF',
    text: isDark ? '#FFF' : '#000',
    inputBg: isDark ? '#1C1C1E' : '#F0F0F0',
    border: isDark ? '#333' : '#ccc',
    primary: '#9C27B0'
  };

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', phone: '', pincode: '', city: '', state: '', house: '', area: ''
  });

  // Track if we have already fetched the location so it doesn't loop
  const hasFetchedLocation = useRef(false);

  // 1. Load saved data on mount
  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem('user_address_data');
      if (saved) setFormData(JSON.parse(saved));
    };
    loadData();
  }, []);

  // 2. Auto-fetch location only ONCE when step becomes 2
  useEffect(() => {
    if (step === 2 && !formData.pincode && !hasFetchedLocation.current) {
      hasFetchedLocation.current = true; // Mark as fetched so it never runs automatically again
      fetchCurrentLocation();
    }
  }, [step, formData.pincode]);

  // 3. Handle Back Button logic
  useEffect(() => {
    const onBackPress = () => {
      if (step === 2) {
        setStep(1);
        return true; // Prevents the app from exiting
      }
      return false; // Allows default back behavior (going to the previous screen)
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );
    return () => backHandler.remove(); // Correctly removing the listener
  }, [step]);

  const handleNext = async () => {
    if (step === 1) {
      // Validate Name and Phone
      if (!formData.name.trim() || !formData.phone.trim()) {
        Alert.alert("Error", "Please fill in your Name and Contact Number.");
        return;
      }
      setStep(2);
    } else {
      // Validate Address fields (Mandatory check)
      if (
        !formData.pincode.trim() || 
        !formData.city.trim() || 
        !formData.state.trim() || 
        !formData.house.trim() || 
        !formData.area.trim()
      ) {
        Alert.alert("Error", "Please fill in all address fields.");
        return;
      }
      
      try {
        await AsyncStorage.setItem('user_address_data', JSON.stringify(formData));
        Alert.alert("Success", "Address Saved!");
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      } catch (error) {
        Alert.alert("Error", "Could not save address");
      }
    }
  };

  const fetchCurrentLocation = async () => {
    setLoading(true);
    
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        setLoading(false);
        Alert.alert("Permission", "Location permission denied.");
        return;
      }
    }

    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("GPS Coordinates:", latitude, longitude);

        try {
          // Headers to prevent Nominatim from blocking the request
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                'User-Agent': 'MyReactApp/1.0 (contact@myreactapp.com)', 
                'Accept': 'application/json'
              }
            }
          );
          
          // Safer parsing: check if the response is actually OK before parsing JSON
          if (!res.ok) {
            const errorText = await res.text();
            console.log("API Blocked:", errorText);
            throw new Error("API request blocked");
          }

          const data = await res.json();
          const addr = data.address;
          
          setFormData(prev => ({ 
            ...prev, 
            pincode: addr.postcode || '', 
            city: addr.city || addr.town || addr.county || '', 
            state: addr.state || '', 
            area: addr.suburb || addr.neighbourhood || addr.road || '' 
          }));
        } catch (e) { 
          console.log("Fetch Error:", e);
          Alert.alert("Error", "Could not fetch address details. Check console.");
        }
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        console.log("GPS Error:", error);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      {step === 1 ? (
        <View>
          <Text style={[styles.header, { color: c.text }]}>Personal Details</Text>
          <TextInput placeholder="Name *" placeholderTextColor={c.text} style={[styles.input, { backgroundColor: c.inputBg, color: c.text }]} value={formData.name} onChangeText={v => setFormData({...formData, name: v})} />
          <TextInput placeholder="Contact Number *" placeholderTextColor={c.text} style={[styles.input, { backgroundColor: c.inputBg, color: c.text }]} value={formData.phone} keyboardType="numeric" onChangeText={v => setFormData({...formData, phone: v})} />
          <TouchableOpacity style={styles.btn} onPress={handleNext}><Text style={styles.btnText}>Next</Text></TouchableOpacity>
        </View>
      ) : (
        <ScrollView>
          <Text style={[styles.header, { color: c.text }]}>Delivery Address</Text>
          {loading && <ActivityIndicator color={c.primary} style={{marginBottom: 10}} />}
          <TextInput placeholder="Pincode *" placeholderTextColor={c.text} value={formData.pincode} style={[styles.input, { backgroundColor: c.inputBg, color: c.text }]} onChangeText={v => setFormData({...formData, pincode: v})} />
          <View style={styles.row}>
            <TextInput placeholder="City *" placeholderTextColor={c.text} value={formData.city} style={[styles.input, {flex: 1, backgroundColor: c.inputBg, color: c.text}]} onChangeText={v => setFormData({...formData, city: v})} />
            <TextInput placeholder="State *" placeholderTextColor={c.text} value={formData.state} style={[styles.input, {flex: 1, backgroundColor: c.inputBg, color: c.text}]} onChangeText={v => setFormData({...formData, state: v})} />
          </View>
          <TextInput placeholder="House no./ Building Name *" placeholderTextColor={c.text} value={formData.house} style={[styles.input, { backgroundColor: c.inputBg, color: c.text }]} onChangeText={v => setFormData({...formData, house: v})} />
          <TextInput placeholder="Road Name / Area *" placeholderTextColor={c.text} value={formData.area} style={[styles.input, { backgroundColor: c.inputBg, color: c.text }]} onChangeText={v => setFormData({...formData, area: v})} />
          <TouchableOpacity style={styles.btn} onPress={handleNext}><Text style={styles.btnText}>Save Address</Text></TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 15 },
  btn: { backgroundColor: '#9C27B0', padding: 15, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  row: { flexDirection: 'row', gap: 10 }
});