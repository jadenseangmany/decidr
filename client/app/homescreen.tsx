import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  View,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';


import { COLORS } from "@/constants/colors";

export default function HomeScreen() {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [loading, setLoading] = useState(true);

  const [initialRegion, setInitialRegion] = useState({
    latitude: 32.8801, // fallback to UCSD
    longitude: -117.2340,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required.");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);

      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      setLoading(false);
    })();
  }, []);

  const goToRecommender = () => router.push("/RecommenderScreen");
  const goToProfile = () => router.push("/profile");

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.text} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        {/* Nav Bar */}
<View style={styles.header}>
  {/* Home button on left (does nothing) */}
    <TouchableOpacity style={styles.navButton} onPress={() => {}}>
        <FontAwesome name="home" size={28} color="#3e6843" />
    </TouchableOpacity>

    {/* App Name */}
    <Text style={styles.appName}>Decidr</Text>

    {/* Profile button on right */}
    <TouchableOpacity
        style={styles.navButton}
        onPress={goToProfile}
    >
        <FontAwesome name="user" size={28} color="#3e6843" />
    </TouchableOpacity>
    </View>

        {/* Map */}
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation
          showsMyLocationButton
        >
          {userLocation && (
            <Marker
              coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
              title="You"
            />
          )}
        </MapView>

        {/* Floating Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={goToRecommender}>
            <Text style={styles.buttonText}>🎲🍽️</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },

  // NAV BAR
header: {
  backgroundColor: COLORS.border, // green
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: 0,
  paddingVertical: 0,
  paddingTop: 20,
  paddingBottom: 20,
  shadowColor: "#333",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.7,
  shadowRadius: 3,
  
},
headerButton: {
  width: 55, // same width as profile button
}, 
  appName: {
  position: 'absolute', // center independent of left/right
  left: 0,
  right: 0,
  textAlign: 'center',
  top: 20, // adjust to match your header padding
  fontSize: 50,
  fontWeight: 'bold',
  color: '#fff',
  shadowColor: "#333",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.7,
  shadowRadius: 3,
  fontFamily: "KetchupManis",
  },

  // Profile Button (white circle with yellow border)
  profileButton: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: COLORS.button, // yellow border
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    shadowColor: "#333",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.7,
    shadowRadius: 3,
  },
  profileButtonText: {
    fontSize: 20,
    textAlign: "center",
  },
  navButton: {
  width: 55,
  height: 55,
  borderRadius: 27.5,
  backgroundColor: "#fff",
  borderWidth: 2,
  borderColor: COLORS.button, // yellow border
  alignItems: "center",
  justifyContent: "center",
  marginHorizontal: 20,
  shadowColor: "#333",
  shadowOffset: { width: 2, height: 3 },
  shadowOpacity: 0.7,
  shadowRadius: 3,
},

  // Floating button
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  button: {
    backgroundColor: COLORS.button,
    borderColor: COLORS.border,
    borderWidth: 2,
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
  },
});
