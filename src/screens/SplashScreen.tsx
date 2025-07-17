import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Button } from '../design-system/components/Button';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/types';

const { width, height } = Dimensions.get('window');

type SplashScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Splash'>;

export const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  return (
    <LinearGradient
      colors={['#2E2464', '#838ACA']}
      locations={[0.0729, 0.9266]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1.1066 }}
      style={styles.gradient}
    >
      {/* Clouds (furthest back) */}
      <Image source={require('../assets/splash/clouds.png')} style={styles.clouds} />
      {/* Hills, layered for depth */}
      <Image source={require('../assets/splash/hill_3.png')} style={styles.hill3} />
      <Image source={require('../assets/splash/hill_2.png')} style={styles.hill2} />
      <Image source={require('../assets/splash/hill_1.png')} style={styles.hill1} />

      {/* Centered logo and text */}
      <View style={styles.centerContent}>
        <Image source={require('../assets/splash/logo.png')} style={styles.logo} />
        <Image source={require('../assets/splash/logo_text.png')} style={styles.logoText} />
      </View>
      {/* Buttons above the clouds */}
      <View style={styles.buttonContainer}>
        <Button
          title="Continue"
          onPress={() => {
            console.log('Continue button pressed, navigating to SignUp');
            navigation.navigate('SignUp');
          }}
          variant="secondary"
          size="medium"
          style={{ width: '75%' }}
        />
        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  clouds: {
    position: 'absolute',
    bottom: -40,
    width: width * 1.3,
    left: '50%',
    transform: [{ translateX: -width * 0.65 }],
    resizeMode: 'contain',
    zIndex: 0,
  },
  hill1: {
    position: 'absolute',
    bottom: -60,
    left: -width * 0.37,
    width: width * 1.66,
    height: width * 0.36,
    resizeMode: 'contain',
    zIndex: 1,
  },
  hill2: {
    position: 'absolute',
    bottom: -60,
    left: -width * 0.32,
    width: width * 1.66,
    height: width * 0.36,
    resizeMode: 'contain',
    zIndex: 2,
    transform: [{ scaleX: -1 }],
  },
  hill3: {
    position: 'absolute',
    bottom: -80,
    left: width * 0.1,
    width: width * 1.66,
    height: width * 0.36,
    resizeMode: 'contain',
    zIndex: 3,
  },
  centerContent: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    transform: [{ translateY: -height * 0.2 }],
    alignItems: 'center',
    zIndex: 10,
  },
  logo: {
    width: 63,
    height: 65,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  logoText: {
    width: 305,
    height: 36,
    resizeMode: 'contain',
  },
  buttonContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    transform: [{ translateY: height * 0.02 }],
    alignItems: 'center',
    zIndex: 20,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 60,
    marginBottom: 16,
  },
  buttonText: {
    color: '#5B4DB1',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    padding: 8,
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    // no underline
  },
}); 