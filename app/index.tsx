import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Hero } from './Hero'; // Import the Hero component with named import

const Index = () => {
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