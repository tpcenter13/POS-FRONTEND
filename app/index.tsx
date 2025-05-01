// index.tsx
import axios from 'axios';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';

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
    <View>
      <Text>Check your console for the response!</Text>
    </View>
  );
};

export default Index;
