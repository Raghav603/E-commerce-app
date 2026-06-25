import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput,
  TouchableOpacity, SafeAreaView, StatusBar,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';


const App = () => {
  const [location, setLocation] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <View style={styles.heroContainer}>
        <FastImage
          source={{
            uri: 'https://content3.jdmagicbox.com/v2/comp/nellore/z8/9999px861.x861.250602202637.b6z8/catalogue/jio-fiber-internet-bv-nagar-nellore-broadband-internet-service-providers-jio-0hlwamhvy3.jpg',
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
          style={styles.heroImage}
          resizeMode={FastImage.resizeMode.cover}
        />

        {/* Gradient + CTA overlay */}
        <LinearGradient
          colors={[
            'transparent',           // top — fully see-through
            'rgba(0,0,0,0.3)',        // mid — subtle dark
            'rgba(0,0,0,0.85)',       // bottom — strong dark for readability
          ]}
          locations={[0, 0.5, 1]}    // where each color stops (0–1)
          style={styles.ctaOverlay}
        >
          <Text style={styles.ctaTitle}>Join JioHome Family</Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter your location"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={location}
              onChangeText={setLocation}
            />
            <Text style={styles.editIcon}>✎</Text>
          </View>
          <View style={styles.underline} />

          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => console.log('Location:', location)}
          >
            <Text style={styles.buttonText}>Get JioHome</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'white' },

  heroContainer: {
    width: '100%',
    height: 620,   
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },

  // LinearGradient replaces the old View — same position, now with gradient
  ctaOverlay: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    paddingHorizontal: 24,
    paddingTop: 80,          // tall padding so gradient has room to fade in
    paddingBottom: 40,
  },

  ctaTitle: { fontSize: 28, fontWeight: '900', color: '#fff', marginBottom: 24 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  input: { flex: 1, fontSize: 17, color: '#fff', paddingVertical: 8 },
  editIcon: { fontSize: 20, color: '#fff' },
  underline: { height: 1, backgroundColor: 'rgba(255,255,255,0.5)', marginBottom: 24 },
  ctaButton: {
    backgroundColor: '#0070C0',
    paddingVertical: 18, borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});

export default App;