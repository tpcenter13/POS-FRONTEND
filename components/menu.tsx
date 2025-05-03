import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type RootStackParamList = {
  Hero: undefined;
  Menu: undefined;
};

export default function MenuButton() {
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.log("No token found for fetchUser");
        return;
      }

      const res = await axios.get("http://127.0.0.1:8000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      
      setUser({
        name: res.data.name,
        role: res.data.role
      });
      
      console.log("User fetched successfully:", res.data);
    } catch (error: any) {
      console.error("Failed to fetch user:", error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        console.log("Token expired or invalid - redirecting to login");
        await AsyncStorage.removeItem("authToken");
        navigation.reset({
          index: 0,
          routes: [{ name: "Hero" }],
        });
      }
    }
  };

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      console.log("Token:", token);
      
      if (!token) {
        Alert.alert("Error", "No token found. You are already logged out.");
        setVisible(false);
        navigation.reset({
          index: 0,
          routes: [{ name: "Hero" }],
        });
        return;
      }

      console.log("Request Headers:", {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      });
      
      const response = await axios.post(
        "http://127.0.0.1:8000/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      
      await AsyncStorage.removeItem("authToken");
      setUser(null);
      Alert.alert("Success", response.data.message || "You have been logged out.");
      setVisible(false);

      navigation.reset({
        index: 0,
        routes: [{ name: "Hero" }],
      });
    } catch (error: any) {
      console.error("Logout error:", error.response?.data || error.message);
      const message =
        error.response?.data?.message || "Failed to log out. Please try again.";
      Alert.alert("Error", message);
      
      if (error.response?.status === 401) {
        await AsyncStorage.removeItem("authToken");
        navigation.reset({
          index: 0,
          routes: [{ name: "Hero" }],
        });
      }
    }
  };

  useEffect(() => {
    if (visible) {
      fetchUser();
    }
  }, [visible]);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        fetchUser();
      }
    };
    
    checkToken();
  }, []);

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
        <View style={styles.linesContainer}>
          <View style={styles.line} />
          <View style={styles.line} />
        </View>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.sidebar}>
            <View style={styles.profileSection}>
              <Ionicons name="person-circle-outline" size={40} color="#555" />
              <Text style={styles.name}>{user?.name || "Loading..."}</Text>
              <Text style={styles.role}>{user?.role || ""}</Text>
            </View>

            <View style={styles.menuItem}>
              <Ionicons name="laptop-outline" size={20} color="#5B9DF9" />
              <Text style={styles.menuTextActive}>Point of Sales</Text>
            </View>

            <View style={styles.menuItem}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.menuText}>Activity</Text>
            </View>

            <View style={styles.menuItem}>
              <Ionicons name="bar-chart-outline" size={20} color="#666" />
              <Text style={styles.menuText}>Report</Text>
            </View>

            <View style={styles.menuItem}>
              <Ionicons name="cube-outline" size={20} color="#666" />
              <Text style={styles.menuText}>Inventory</Text>
            </View>

            <View style={styles.menuItem}>
              <Ionicons name="people-outline" size={20} color="#666" />
              <Text style={styles.menuText}>Teams</Text>
            </View>

            <View style={styles.menuItem}>
              <Ionicons name="settings-outline" size={20} color="#666" />
              <Text style={styles.menuText}>Settings</Text>
            </View>

            <TouchableOpacity style={styles.logout} onPress={handleLogout}>
              <MaterialIcons name="logout" size={20} color="#f44" />
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 34,
    height: 34,
    borderRadius: 32,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    marginRight: 10,
  },
  linesContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  line: {
    width: 15,
    height: 3,
    backgroundColor: "#5B9DF9",
    borderRadius: 3,
  },
  overlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  sidebar: {
    width: 250,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60,
    justifyContent: "space-between",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  role: {
    fontSize: 12,
    color: "#666",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 14,
    color: "#333",
  },
  menuTextActive: {
    fontSize: 14,
    color: "#5B9DF9",
    fontWeight: "bold",
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    marginTop: 20,
  },
  logoutText: {
    color: "#f44",
    fontWeight: "bold",
  },
});