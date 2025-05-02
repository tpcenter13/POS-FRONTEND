import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import { AxiosError } from 'axios';

// Local development server
const apiUrl = 'http://127.0.0.1:8000';

export const Hero = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        let token: string | null = null;
        if (Platform.OS === 'web') {
          if (typeof window !== 'undefined' && window.localStorage) {
            token = window.localStorage.getItem('authToken');
          }
        } else {
          token = await AsyncStorage.getItem('authToken');
        }

        if (token) {
          router.push('/LandingPage');
        }
      } catch (e) {
        console.warn('Failed to check auth token:', e);
      }
    };
    checkAuth();
  }, []);

  const handleSignIn = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/api/login`, {
        email: username, // Updated to 'email' to match your backend expectation
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      const { token, user } = response.data;

      try {
        if (Platform.OS === 'web') {
          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem('authToken', token);
          } else {
            throw new Error('localStorage is not available');
          }
        } else {
          await AsyncStorage.setItem('authToken', token);
          await AsyncStorage.setItem('user', JSON.stringify(user));
        }
      } catch (e) {
        console.warn('Storage access failed:', e);
        Alert.alert('Warning', 'Sign-in successful, but failed to store token. You may need to sign in again.');
      }

      Alert.alert('Success', `Welcome back, ${user.name}!`); // Updated to 'name' to match your backend

      setUsername('');
      setPassword('');

      router.push('/LandingPage');
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      console.error('Signin error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to sign in';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Left Panel */}
      <View style={styles.leftPanel}>
        <Text style={styles.logo}>POS</Text>
        <View style={styles.heroContentContainer}>
          <Image
            source={require('../assets/images/chair.avif')}
            style={styles.heroImage}
            resizeMode="cover"
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
            autoCapitalize="none"
            editable={!isLoading}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              editable={!isLoading}
            />
            <TouchableOpacity
              style={styles.showPasswordBtn}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.showPasswordText}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.signInButton, isLoading ? styles.buttonDisabled : null]}
            onPress={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.signInButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row' as const,
    backgroundColor: '#222',
    borderRadius: 12,
    overflow: 'hidden',
  } as const,
  leftPanel: {
    flex: 1,
    backgroundColor: '#7b68ee',
    padding: 24,
    justifyContent: 'space-between',
  } as const,
  logo: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: 'white',
  } as const,
  heroContentContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 40,
  } as const,
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 40,
  } as const,
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: 'white',
    marginBottom: 5,
  } as const,
  rightPanel: {
    flex: 1,
    backgroundColor: '#222',
    padding: 24,
    justifyContent: 'center',
  } as const,
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  } as const,
  formTitle: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: 'white',
    marginBottom: 32,
  } as const,
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    color: 'white',
  } as const,
  passwordContainer: {
    position: 'relative' as const,
    marginBottom: 16,
  } as const,
  showPasswordBtn: {
    position: 'absolute' as const,
    right: 16,
    top: 12,
  } as const,
  showPasswordText: {
    color: '#7b68ee',
    fontSize: 14,
  } as const,
  signInButton: {
    backgroundColor: '#7b68ee',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center' as const,
    marginBottom: 24,
  } as const,
  buttonDisabled: {
    opacity: 0.6,
  } as const,
  signInButtonText: {
    color: 'white',
    fontWeight: 'bold' as const,
  } as const,
});

