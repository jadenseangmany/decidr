import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import FilterRow from "../components/FilterRow";
import DropdownRow from "../components/DropdownRow";
import { COLORS } from "../constants/theme";
import { PriceCategory } from "@/models/recommender";

export default function RecommenderScreen() {
  const [radius, setRadius] = useState(5);
  const [priceCategory, setPriceCategory] = useState<
    PriceCategory | "------------------------"
  >("------------------------");
  const [cuisine, setCuisine] = useState("------------------------");

  const priceOptions: PriceCategory[] = [
    "Cheap",
    "Moderate",
    "Expensive",
    "Very Expensive",
  ];
  const cuisineOptions = ["Italian", "Mexican", "Japanese", "Fast Food"]; // placeholder
  const [userLocation, setUserLocation] = useState<any>(null);

  // default if location not found
  const [region, setRegion] = useState({
    latitude: 45.5017,
    longitude: -73.5673,
    latitudeDelta: 0,
    longitudeDelta: 0.0001,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "We need location access.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);

      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
  }, []);

  // refresh map when userlocation or radius changes
  useEffect(() => {
    if (userLocation) {
      setRegion((prevRegion) => ({
        ...prevRegion,
        latitudeDelta: 0.002 * radius,
        longitudeDelta: 0.002 * radius,
      }));
    }
  }, [radius, userLocation]);

  const handleGenerate = () => {
    console.log("Generating with:", { radius, price: priceCategory, cuisine });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Recommender</Text>

          <FilterRow
            label="Radius"
            value={radius}
            unit=" mi"
            min={1}
            max={50}
            step={1}
            onValueChange={setRadius}
          />

          <View style={styles.mapContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={region}
              onRegionChangeComplete={setRegion}
              showsUserLocation={true}
              showsMyLocationButton={true}
            >
              {userLocation && (
                <Marker
                  coordinate={{
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                  }}
                  title="You are here"
                  pinColor="red"
                />
              )}
            </MapView>
          </View>

          <DropdownRow
            label="Price"
            selectedValue={priceCategory}
            options={priceOptions}
            onSelect={(val) => setPriceCategory(val)}
          />

          <DropdownRow
            label="Cuisine"
            selectedValue={cuisine}
            options={cuisineOptions}
            onSelect={(val) => setCuisine(val)}
          />

          <TouchableOpacity style={styles.button} onPress={handleGenerate}>
            <Text style={styles.buttonText}>Generate!</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 50,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "serif",
    color: "#000",
  },
  mapContainer: {
    height: 280,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#FFF",
    marginVertical: 10,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  cuisineRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  labelOval: {
    backgroundColor: COLORS.main,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  labelText: { color: "#FFF", fontWeight: "bold" },
  dropdownPlaceholder: {
    flex: 1,
    backgroundColor: COLORS.highlightYellow,
    marginLeft: 15,
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  button: {
    backgroundColor: COLORS.highlightOrange,
    paddingVertical: 8,
    width: 200,
    borderRadius: 35,
    marginTop: 100,
    margin: "auto",
    alignItems: "center",
  },
  buttonText: { color: COLORS.textLight, fontSize: 20, fontWeight: "bold" },
});
