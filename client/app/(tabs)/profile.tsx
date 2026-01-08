import { ScrollView, StyleSheet, View, Image, Pressable, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useState, useEffect } from 'react'
import { AppColors } from '@/constants/theme'
import { useRouter } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons';
import { clearAuth, getUsername } from '@/utils/auth';
import { API_BASE_URL } from '@/constants/api';

// Type for visited restaurant from backend
interface VisitedRestaurant {
  restaurant_id: string;
  name: string;
  location: string;
  visited_at: string;
  rating?: number;
  image_url?: string;
  cuisine?: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<VisitedRestaurant[]>([]);
  const [savedRestaurants, setSavedRestaurants] = useState<VisitedRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUsername = await getUsername();
        setUsername(storedUsername);

        if (storedUsername) {
          // Fetch both visited and saved restaurants
          const [visitedRes, savedRes] = await Promise.all([
            fetch(`${API_BASE_URL}/users/${storedUsername}/visited-restaurants`),
            fetch(`${API_BASE_URL}/users/${storedUsername}/saved-restaurants`)
          ]);

          const visitedData = await visitedRes.json();
          const savedData = await savedRes.json();

          setRestaurants(visitedData.visited_restaurants || []);
          setSavedRestaurants(savedData.saved_restaurants || []);
        }
      } catch (error) {
        console.error("Failed to fetch restaurant data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const goToHome = () => router.push('/homescreen');
  const logout = async () => {
    await clearAuth();
    router.push('/login');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      {/* Header */}
      <View style={styles.header}>
        {/* Home button on left */}
        <TouchableOpacity style={styles.navButton} onPress={goToHome}>
          <FontAwesome name="home" size={28} color="#3e6843" />
        </TouchableOpacity>

        {/* App name */}
        <Text style={styles.appName}>Decidr</Text>

        {/* Profile button on right (no action) */}
        <TouchableOpacity style={styles.navButton} onPress={() => { }}>
          <FontAwesome name="user" size={28} color="#3e6843" />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profile}>
        <Pressable style={styles.profilePictureBorder}>
          <Image
            source={require('@/assets/images/profile-pic-icon.png')}
            style={styles.profileImage}
          />
        </Pressable>
        <View style={styles.usernameBorder} >
          <Text style={styles.username}>{username || 'Loading...'}</Text>
        </View>
      </View>

      {/* Saved Restaurants Section */}
      <View style={styles.restaurantHeader}>
        <Text style={styles.restaurantText}>🔖 Saved Restaurants</Text>
      </View>
      <View style={styles.restaurantContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={AppColors.primaryGreen} style={{ padding: 20 }} />
        ) : savedRestaurants.length === 0 ? (
          <Text style={styles.emptyText}>No saved restaurants yet. Tap the bookmark icon to save!</Text>
        ) : (
          savedRestaurants.map((restaurant) => (
            <View key={restaurant.restaurant_id + restaurant.visited_at} style={styles.restaurantCard}>
              <Image
                source={restaurant.image_url ? { uri: restaurant.image_url } : require('@/assets/images/placeholder-restaurant.jpeg')}
                style={styles.restaurantImage}
              />
              <View style={styles.restaurantInfo}>
                <View style={styles.restaurantNameContainer}>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                </View>
                {restaurant.cuisine && <Text style={styles.restaurantDetail}>🍴 {restaurant.cuisine}</Text>}
                <Text style={styles.restaurantDetail}>📍 {restaurant.location}</Text>
                {restaurant.rating && <Text style={styles.restaurantRating}>⭐ {restaurant.rating}</Text>}
              </View>
            </View>
          ))
        )}
      </View>

      {/* Restaurant History Section */}
      <View style={styles.restaurantHeader}>
        <Text style={styles.restaurantText}>📜 Restaurant History</Text>
      </View>
      <View style={styles.restaurantContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={AppColors.primaryGreen} style={{ padding: 20 }} />
        ) : restaurants.length === 0 ? (
          <Text style={styles.emptyText}>No restaurants yet. Generate some recommendations!</Text>
        ) : (
          restaurants.map((restaurant) => (
            <View key={restaurant.restaurant_id + restaurant.visited_at} style={styles.restaurantCard}>
              <Image
                source={restaurant.image_url ? { uri: restaurant.image_url } : require('@/assets/images/placeholder-restaurant.jpeg')}
                style={styles.restaurantImage}
              />
              <View style={styles.restaurantInfo}>
                <View style={styles.restaurantNameContainer}>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                </View>
                {restaurant.cuisine && <Text style={styles.restaurantDetail}>🍴 {restaurant.cuisine}</Text>}
                <Text style={styles.restaurantDetail}>📍 {restaurant.location}</Text>
                <Text style={styles.restaurantDetail}>📅 {new Date(restaurant.visited_at).toLocaleDateString()}</Text>
                {restaurant.rating && <Text style={styles.restaurantRating}>⭐ {restaurant.rating}</Text>}
              </View>
            </View>
          ))
        )}
      </View>

      {/* Logout Button at Bottom */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF9",
  },

  // Nav Bar
  header: {
    backgroundColor: AppColors.primaryGreen,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  navButton: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: AppColors.primaryYellow, // yellow border
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#333",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.7,
    shadowRadius: 3,
  },
  appName: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#fff',
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 3,
    fontFamily: 'KetchupManis'
  },

  profile: {
    alignItems: 'center',
  },
  profilePictureBorder: {
    width: 102,
    height: 102,
    borderRadius: 51,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.7,
    shadowRadius: 3,
    borderWidth: 4,
    borderColor: AppColors.primaryYellow,
    marginBottom: 20,
    overflow: "hidden",
  },
  profileImage: {
    width: 110,
    height: 115,
    borderRadius: 50,
    overflow: "hidden",
  },
  usernameBorder: {
    borderWidth: 2,
    borderRadius: 10,
    width: 200,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderColor: AppColors.primaryYellow,
    backgroundColor: AppColors.appBackground,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  username: {
    fontSize: 15,
    alignItems: 'center',
    fontFamily: 'Quicksand',
    fontWeight: '600'
  },

  restaurantHeader: {
    marginLeft: 25,
    marginTop: 50,
    flexWrap: 'wrap',
  },
  restaurantText: {
    fontSize: 24,
    fontFamily: 'KetchupManis',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingBottom: 2,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  restaurantContainer: {
    backgroundColor: AppColors.appBackground,
    borderRadius: 15,
    marginHorizontal: 20,
    marginVertical: 15,
    borderWidth: 2,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderColor: AppColors.primaryYellow,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  restaurantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    marginHorizontal: 15,
    width: '90%',
    alignSelf: 'center',
    borderWidth: 1.5,
    borderColor: AppColors.primaryYellow,
    backgroundColor: '#FFFDF9',
    padding: 10,
    borderRadius: 10,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3
  },
  restaurantImage: {
    width: 120,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppColors.primaryYellow,
    marginLeft: 10,
    marginRight: 20
  },
  restaurantInfo: {
    flex: 1,
    justifyContent: 'center'
  },
  restaurantNameContainer: {
    alignSelf: 'flex-start',
  },
  restaurantName: {
    fontSize: 17,
    fontFamily: 'KetchupManis',
    color: "#1F1F1F",
    borderBottomWidth: 1.5,
    borderBottomColor: '#1F1F1F',
    marginBottom: 6,
  },
  restaurantDetail: {
    fontSize: 14,
    fontFamily: 'QuickSand',
    fontWeight: '600',
    marginBottom: 6,
  },
  restaurantRating: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    padding: 20,
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },

  // Logout button
  logoutContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: AppColors.primaryYellow,
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: AppColors.primaryGreen,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  }
})
