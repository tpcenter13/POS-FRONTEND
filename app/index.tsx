import axios from 'axios';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Hero from './Hero'; // Import the Hero component

const apiUrl = 'https://pos-backend-xtd3.onrender.com'; // Replace with your backend URL

const Index = () => {
  useEffect(() => {
    const pingBackend = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/ping`);
        console.log(response.data); // { message: 'pong from backend' }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    pingBackend();
  }, []); // Empty dependency array ensures it runs once when the component mounts
  
  return (
    <View style={styles.container}>
      <Hero />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1f',
    padding: 20,
  },
});

export default Index;