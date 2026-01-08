import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import FilterRow from "../components/FilterRow";
import DropdownRow from "../components/DropdownRow";
import LocationMap from "../components/LocationMap";
import RestaurantCard, { Restaurant } from "../components/RestaurantCard";
import { COLORS } from "../constants/theme";
import { PriceCategory } from "@/models/recommender";
import { API_BASE_URL } from "@/constants/api";
import { getUsername } from "@/utils/auth";

// Map price category to Yelp price format (1-4)
const priceCategoryToYelp: Record<PriceCategory, string> = {
  "Cheap": "1",
  "Moderate": "2",
  "Expensive": "3",
  "Very Expensive": "4",
};

// Map cuisine to Yelp categories
const cuisineToYelp: Record<string, string> = {
  "Italian": "italian",
  "Mexican": "mexican",
  "Japanese": "japanese",
  "Fast Food": "hotdogs,burgers,sandwiches",
};

export default function RecommenderScreen() {
  const [radius, setRadius] = useState(5);
  const [priceCategory, setPriceCategory] = useState<
    PriceCategory | "Surprise me!"
  >("Surprise me!");
  const [cuisine, setCuisine] = useState("Surprise me!");
  const [resultIndex, setResultIndex] = useState(0);

  const priceOptions: PriceCategory[] = [
    "Cheap",
    "Moderate",
    "Expensive",
    "Very Expensive",
  ];
  const cuisineOptions = ["Italian", "Mexican", "Japanese", "Fast Food"];

  const [userLocation, setUserLocation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [showCard, setShowCard] = useState(false);

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

  // Save restaurant to user's history
  const saveRestaurantToHistory = async (restaurantData: Restaurant) => {
    try {
      const username = await getUsername();
      if (!username) {
        console.log("No username found, skipping history save");
        return;
      }

      const locationStr = restaurantData.location?.city
        ? `${restaurantData.location.address1 || ''}, ${restaurantData.location.city}`
        : restaurantData.location?.display_address?.join(', ') || '';

      const cuisineStr = restaurantData.categories?.[0]?.title || '';

      await fetch(`${API_BASE_URL}/users/${username}/visited-restaurants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurant_id: restaurantData.id,
          name: restaurantData.name,
          location: locationStr,
          rating: restaurantData.rating,
          image_url: restaurantData.image_url,
          cuisine: cuisineStr,
        }),
      });
    } catch (error) {
      console.error("Failed to save restaurant to history:", error);
    }
  };

  const handleGenerate = async () => {
    if (!userLocation) {
      Alert.alert("Location Required", "Please enable location access.");
      return;
    }

    setLoading(true);
    setRestaurant(null);

    try {
      // Build query params
      const params = new URLSearchParams({
        lat: userLocation.latitude.toString(),
        lng: userLocation.longitude.toString(),
        miles: radius.toString(),
        index: resultIndex.toString(),
      });

      // Add optional filters
      if (priceCategory !== "Surprise me!") {
        params.append("priceLimit", priceCategoryToYelp[priceCategory as PriceCategory]);
      }
      if (cuisine !== "Surprise me!") {
        params.append("cuisine", cuisineToYelp[cuisine] || cuisine.toLowerCase());
      }

      const url = `${API_BASE_URL}/api/yelp/restaurants?${params}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get recommendations");
      }

      if (data.businesses) {
        setRestaurant(data.businesses);
        setShowCard(true);
        // Increment index for next generation to get different result
        setResultIndex((prev) => prev + 1);

        // Save to user's restaurant history
        const restaurantData = data.businesses as Restaurant;
        saveRestaurantToHistory(restaurantData);
      } else {
        Alert.alert("No Results", "No restaurants found with your criteria. Try adjusting filters.");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to generate recommendation");
    } finally {
      setLoading(false);
    }
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

          <LocationMap
            region={region}
            onRegionChange={setRegion}
            userLocation={userLocation}
          />

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

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.textLight} />
            ) : (
              <Text style={styles.buttonText}>Generate!</Text>
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* Restaurant Card Modal */}
        <RestaurantCard
          restaurant={restaurant}
          visible={showCard}
          onClose={() => setShowCard(false)}
          onTryAnother={() => {
            setShowCard(false);
            handleGenerate();
          }}
          onSelect={(r) => {
            setShowCard(false);
            Alert.alert("Selected!", `You chose ${r.name}`);
          }}
        />
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
    fontSize: 40,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "serif",
    color: "#000",
  },
  button: {
    backgroundColor: COLORS.highlightOrange,
    paddingVertical: 12,
    width: 200,
    borderRadius: 35,
    marginTop: 30,
    alignSelf: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.textLight,
    fontSize: 20,
    fontWeight: "bold"
  },
});
