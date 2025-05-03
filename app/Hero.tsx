import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';
import { router } from 'expo-router';
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
        if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
          token = window.localStorage.getItem('authToken');
        } else {
          token = await AsyncStorage.getItem('authToken');
        }
        console.log('Checking auth token:', token);
        if (token) {
          const isValid = await validateToken(token);
          if (isValid) {
            router.push('/LandingPage');
          } else {
            clearToken();
          }
        }
      } catch (e) {
        console.warn('Failed to check auth token:', e);
        clearToken();
      }
    };
    checkAuth();
  }, []);

  const validateToken = async (token: string) => {
    try {
      await axios.get(`${apiUrl}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Token validated successfully');
      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  };

  const clearToken = async () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem('authToken');
    } else {
      await AsyncStorage.removeItem('authToken');
    }
  };

  const handleSignIn = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/api/login`, {
        email: username,
        password,
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      });

      const { token, user } = response.data;

      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('authToken', token);
      } else {
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
      }
      console.log('Token stored:', token);

      Alert.alert('Success', `Welcome back, ${user.name}!`);
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
  },
  heroContentContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 40,
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 40,
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
  showPasswordBtn: {
    position: 'absolute',
    right: 16,
    top: 12,
  },
  showPasswordText: {
    color: '#7b68ee',
    fontSize: 14,
  },
  signInButton: {
    backgroundColor: '#7b68ee',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signInButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});