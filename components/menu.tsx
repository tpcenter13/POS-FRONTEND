import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function MenuButton() {
  return (
  
      <TouchableOpacity style={styles.button}>
        <View style={styles.linesContainer}>
          <View style={styles.line} />
          <View style={styles.line} />
        </View>
      </TouchableOpacity>
    
  );
}

const styles = StyleSheet.create({
  
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  linesContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 8, // React Native 0.71+ supports gap, otherwise use margin
  },
  line: {
    width: 40,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#5B9DF9",
    marginVertical: 2,
  },
});
