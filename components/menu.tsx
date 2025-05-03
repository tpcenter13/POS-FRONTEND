import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type RootStackParamList = {
  Hero: undefined;
  Menu: undefined;
  LandingPage: undefined;
  Inventory: undefined;
};

export default function MenuButton() {
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [activeMenu, setActiveMenu] = useState("Point of Sales");
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
        role: res.data.role,
      });

      console.log("User fetched successfully:", res.data);
    } catch (error: any) {
      console.error("Failed to fetch user:", error.response?.data || error.message);

      if (error.response?.status === 401) {
        console.log("Token expired or invalid - redirecting to login");
        await AsyncStorage.removeItem("authToken");
        navigation.push("Hero");
      }
    }
  };

  // New function to validate token
  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      return res.status === 200;
    } catch (error: any) {
      console.error("Token validation failed:", error.response?.data || error.message);
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      console.log("Token:", token);

      if (!token) {
        Alert.alert("Error", "No token found. You are already logged out.");
        setVisible(false);
        navigation.push("Hero");
        return;
      }

      // Validate token before logout
      const isValid = await validateToken(token);
      if (!isValid) {
        console.log("Invalid token - clearing and redirecting to Hero");
        await AsyncStorage.removeItem("authToken");
        setUser(null);
        setVisible(false);
        navigation.push("Hero");
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

      // Navigate to Hero (login screen) instead of LandingPage
      navigation.push("Hero");

      // Open the external URL in the default browser
      const url = "http://localhost:8081/";
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Cannot open URL: " + url);
      }
    } catch (error: any) {
      console.error("Logout error:", error.response?.data || error.message);
      const message =
        error.response?.data?.message || "Failed to log out. Please try again.";
      Alert.alert("Error", message);

      if (error.response?.status === 401) {
        await AsyncStorage.removeItem("authToken");
        navigation.push("Hero");
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
        const isValid = await validateToken(token);
        if (isValid) {
          fetchUser();
        } else {
          console.log("Invalid token on check - clearing and redirecting to Hero");
          await AsyncStorage.removeItem("authToken");
          navigation.push("Hero");
        }
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

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setActiveMenu("Point of Sales");
                navigation.navigate("LandingPage");
              }}
            >
              <Ionicons
                name="laptop-outline"
                size={20}
                color={activeMenu === "Point of Sales" ? "#5B9DF9" : "#666"}
              />
              <Text
                style={
                  activeMenu === "Point of Sales"
                    ? styles.menuTextActive
                    : styles.menuText
                }
              >
                Point of Sales
              </Text>
            </TouchableOpacity>

            <View style={styles.menuItem}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.menuText}>Activity</Text>
            </View>

            <View style={styles.menuItem}>
              <Ionicons name="bar-chart-outline" size={20} color="#666" />
              <Text style={styles.menuText}>Report</Text>
            </View>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setActiveMenu("Inventory");
                navigation.navigate("Inventory");
              }}
            >
              <Ionicons
                name="cube-outline"
                size={20}
                color={activeMenu === "Inventory" ? "#5B9DF9" : "#666"}
              />
              <Text
                style={
                  activeMenu === "Inventory"
                    ? styles.menuTextActive
                    : styles.menuText
                }
              >
                Inventory
              </Text>
            </TouchableOpacity>

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