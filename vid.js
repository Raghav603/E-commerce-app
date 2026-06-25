import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform
} from 'react-native';
import Video from 'react-native-video';

const JioHomeScreenRemake = () => {
  return (
    <SafeAreaView style={styles.container}>
      
      {/* Wrapper forcing content into the Top 50% of the screen */}
      <View style={styles.topHalfContainer}>
        
        {/* Top Logo */}
        <Text style={styles.mainLogo}>JioHome</Text>

        {/* Hero Ad Card */}
        <View style={styles.heroCard}>
          
          {/* Extended Video Player Area (Acting as the TV) */}
          <View style={styles.tvSection}>
            {/* TV Screen Container */}
            <View style={styles.tvContainer}>
               <Video
                source={{ uri: 'https://www.w3schools.com/html/mov_bbb.mp4' }}
                style={styles.videoPlayer}
                resizeMode="cover"
                repeat={true}
                muted={true}
                playInBackground={false}
              />
            </View>
          </View>

          {/* T&C text positioned absolutely to the bottom left */}
          <Text style={styles.tncText}>T&C Apply</Text>
        </View>

        {/* Bottom Typography */}
        <View style={styles.bottomSection}>
          <Text style={styles.headline}>
            India's latest home{'\n'}entertainment and Wi-Fi
          </Text>

          {/* Call to Action Button */}
          <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8}>
            <Text style={styles.ctaText}>Get JioHome</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E6E6', // Light gray background
  },
  topHalfContainer: {
    height: '55%', // Forces the UI to stop exactly at the halfway mark
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 10,
    justifyContent: 'space-between', // Spreads the logo, card, and text evenly
    backgroundColor:'gray'
  },
  mainLogo: {
    fontSize: 26, // Slightly scaled down
    fontWeight: '900',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  heroCard: {
    flex: 1, // Automatically sizes itself based on remaining space
    marginVertical: 15, // Creates spacing from the top logo and bottom text
    backgroundColor: '#F3EFE9', // Warm beige background
    borderRadius: 12,
    overflow: 'hidden', 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    // paddingVertical: 15,
    position: 'relative', // Context for T&C absolute positioning
  },
  tvSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: 20,
    // marginBottom: 15, // Prevents overlapping with T&C text
  },
  tvContainer: {
    width: '100%',
    height: '100%', 

  },
  videoPlayer: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: '#111',
  },
  tncText: {
    position: 'absolute',
    bottom: 2,            
    left: 15,             
    fontSize: 7,
    color: 'blue',
  },
  bottomSection: {
    // Removed massive top margin since container uses space-between
  },
  headline: {
    fontSize: 24, // Scaled down to fit the smaller container height
    fontWeight: '900',
    color: '#1A1A1A',
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  ctaButton: {
    backgroundColor: '#3D78B2', // Matching the specific blue tone
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 30,
    marginTop: 15,
    alignSelf: 'flex-start',
  },
  ctaText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default JioHomeScreenRemake;


// [
//   {
//     "Headerdetils": {
//       "title": " JioHomr",
//       "subtiel": ""
//     },
//     "cellzlsyouy": {

//     },
//     "VireConey"
//   },
//   {}
// ]