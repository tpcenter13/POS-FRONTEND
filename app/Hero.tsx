import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Import router from expo-router for navigation
import { router } from 'expo-router';

const apiUrl = 'https://pos-backend-xdt3.onrender.com'; // Update to match your backend port if needed

const Hero = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/api/auth/signin`, {
        username,
        password,
      });

      const { token, user } = response.data;

      // Store token based on platform, with error handling
      try {
        if (Platform.OS === 'web') {
          localStorage.setItem('authToken', token);
        } else {
          await AsyncStorage.setItem('authToken', token);
        }
      } catch (e) {
        console.warn('Storage access failed:', e);
      }

      Alert.alert('Success', `Welcome back, ${user.username}!`);

      // Reset form
      setUsername('');
      setPassword('');

      // Navigate to LandingPage
      router.push('/LandingPage');

    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      console.error('Signin error:', err);
      Alert.alert('Error', err.response?.data?.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Left Panel */}
      <View style={styles.leftPanel}>
        <Text style={styles.logo}>POS</Text>
        <View style={styles.heroContent}>
          <Image
            source={require('../assets/images/chair.avif')}
            style={styles.heroImage}
          />
          <Text style={styles.heroTitle}>Capturing Moments,</Text>
          <Text style={styles.heroTitle}>Creating Memories</Text>
        </View>
      </View>

      {/* Right Panel - Form */}
      <View style={styles.rightPanel}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Sign In to POS</Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            style={[styles.createButton, isLoading ? styles.buttonDisabled : {}]}
            onPress={handleSignIn}
            disabled={isLoading}
          >
            <Text style={styles.createButtonText}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#222',
    borderRadius: 12,
    overflow: 'hidden',
  },
  leftPanel: {
    flex: 1,
    backgroundColor: '#7b68ee',
    padding: 24,
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 40,
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 40,
    resizeMode: 'cover',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  rightPanel: {
    flex: 1,
    backgroundColor: '#222',
    padding: 24,
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  formTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 32,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    color: 'white',
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#7b68ee',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Hero;
