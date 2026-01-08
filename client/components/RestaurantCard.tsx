import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Modal,
    Dimensions,
    Alert,
    ScrollView,
    Share,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";
import { getUsername } from "../utils/auth";
import { API_BASE_URL } from "../constants/api";

// Restaurant type from Yelp API (enriched with recommendation data)
export interface Restaurant {
    id: string;
    name: string;
    rating: number;
    review_count: number;
    location?: {
        address1?: string;
        address2?: string;
        address3?: string;
        city?: string;
        state?: string;
        display_address?: string[];
    };
    price?: string;
    categories?: Array<{ title: string }>;
    image_url?: string;
    url?: string;
    attributes?: {
        about_this_biz_history?: string;
        about_this_biz_specialties?: string;
    };
    business_hours?: Array<{
        is_open_now?: boolean;
    }>;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    // Computed by backend (from Google Maps)
    driving_time_minutes?: number;
}

interface RestaurantCardProps {
    restaurant: Restaurant | null;
    visible: boolean;
    onClose: () => void;
    onTryAnother: () => void;
    onSelect: (restaurant: Restaurant) => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Map Yelp price to approximate cost per person
const priceToAmount: Record<string, string> = {
    "$": "$10",
    "$$": "$25",
    "$$$": "$50",
    "$$$$": "$100",
};

// Get the location display - shows "Street Name, City" format
const getLocationDisplay = (location: Restaurant["location"]): string => {
    if (!location) return "";

    // Extract street name from address1 (remove house number at start)
    let streetName = "";
    if (location.address1) {
        // Remove leading numbers and any following spaces (e.g., "6780 Miramar Rd" -> "Miramar Rd")
        streetName = location.address1.replace(/^\d+\s*/, "");
    }

    // Return "Street Name, City" format
    if (streetName && location.city) {
        return `${streetName}, ${location.city}`;
    }

    // Fallback to just city
    return location.city || "";
};

export default function RestaurantCard({
    restaurant,
    visible,
    onClose,
    onTryAnother,
    onSelect,
}: RestaurantCardProps) {
    if (!restaurant) return null;

    const hasDescription = !!restaurant.attributes?.about_this_biz_history;

    // Use driving time from backend (Google Maps API)

    const handleSave = async () => {
        try {
            const username = await getUsername();
            if (!username) {
                Alert.alert("Not Logged In", "Please log in to save restaurants.");
                return;
            }

            const locationStr = restaurant.location?.city
                ? `${restaurant.location.address1 || ''}, ${restaurant.location.city}`
                : restaurant.location?.display_address?.join(', ') || '';

            const cuisineStr = restaurant.categories?.[0]?.title || '';

            const response = await fetch(`${API_BASE_URL}/users/${username}/saved-restaurants`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    restaurant_id: restaurant.id,
                    name: restaurant.name,
                    location: locationStr,
                    rating: restaurant.rating,
                    image_url: restaurant.image_url,
                    cuisine: cuisineStr,
                }),
            });

            if (response.ok) {
                Alert.alert("Saved!", `${restaurant.name} has been saved to your list.`);
            } else {
                Alert.alert("Error", "Failed to save restaurant.");
            }
        } catch (error) {
            console.error("Failed to save restaurant:", error);
            Alert.alert("Error", "Failed to save restaurant.");
        }
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out ${restaurant.name} on Yelp!`,
                url: restaurant.url || `https://www.yelp.com/biz/${restaurant.id}`,
            });
        } catch (error) {
            console.error("Error sharing:", error);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.card, hasDescription && styles.cardWithDescription]}>
                    {/* Top Left Icons - Share & Save */}
                    <View style={styles.topLeftIcons}>
                        <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
                            <FontAwesome6 name="arrow-up-from-bracket" size={18} color="#333" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton} onPress={handleSave}>
                            <FontAwesome6 name="bookmark" size={18} color="#333" />
                        </TouchableOpacity>
                    </View>

                    {/* Close Button */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>

                    {/* Scrollable Content */}
                    <ScrollView
                        style={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Hero Image - Full width at top */}
                        {restaurant.image_url && (
                            <Image
                                source={{ uri: restaurant.image_url }}
                                style={styles.restaurantImage}
                            />
                        )}

                        {/* Content Area with Padding */}
                        <View style={styles.contentArea}>
                            {/* Restaurant Name */}
                            <Text style={styles.restaurantName}>
                                {restaurant.name}
                            </Text>

                            {/* Info Section */}
                            <View style={styles.infoSection}>
                                {/* Category */}
                                {restaurant.categories && restaurant.categories.length > 0 && (
                                    <Text style={styles.infoRow}>
                                        🍽️ {restaurant.categories[0].title}
                                    </Text>
                                )}

                                {/* Location */}
                                {restaurant.location && (
                                    <Text style={styles.infoRow}>
                                        📍 {getLocationDisplay(restaurant.location)}
                                    </Text>
                                )}

                                {/* Price */}
                                {restaurant.price && (
                                    <Text style={styles.infoRow}>
                                        💵 {priceToAmount[restaurant.price] || "$25"}
                                    </Text>
                                )}

                                {/* Open/Closed status */}
                                <Text style={styles.infoRow}>
                                    {restaurant.business_hours?.[0]?.is_open_now
                                        ? "🟢 Open Now"
                                        : "🔴 Closed"}
                                </Text>

                                {/* Star Rating */}
                                <View style={styles.ratingContainer}>
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Text key={i} style={styles.starIcon}>
                                            {i <= Math.round(restaurant.rating) ? "⭐" : "☆"}
                                        </Text>
                                    ))}
                                    <Text style={styles.ratingText}>{restaurant.rating}</Text>
                                    <Text style={styles.description}>
                                        ({restaurant.review_count} reviews)
                                    </Text>
                                </View>
                            </View>

                            {/* Business History/Description */}
                            {restaurant.attributes?.about_this_biz_history && (
                                <Text style={styles.historyText}>
                                    {restaurant.attributes.about_this_biz_history}
                                </Text>
                            )}
                        </View>
                    </ScrollView>

                    {/* Action Buttons - Fixed at bottom */}
                    <View style={styles.actionButtonsRow}>
                        <TouchableOpacity
                            style={styles.tryAnotherButton}
                            onPress={onTryAnother}
                        >
                            <Text style={styles.buttonText}>Reroll</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.selectButton}
                            onPress={() => onSelect(restaurant)}
                        >
                            <View style={styles.selectButtonContent}>
                                <FontAwesome6 name="car" size={16} color="#FFF" />
                                <Text style={styles.buttonText}>
                                    {restaurant.driving_time_minutes ? `${restaurant.driving_time_minutes} min` : "Go"}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    card: {
        width: SCREEN_WIDTH - 40,
        maxWidth: 400,
        height: SCREEN_HEIGHT * 0.54,
        backgroundColor: "#F5F0E6",
        borderRadius: 20,
        overflow: "hidden",
        position: "relative",
    },
    cardWithDescription: {
        height: SCREEN_HEIGHT * 0.6,
    },
    topLeftIcons: {
        position: "absolute",
        top: 15,
        left: 15,
        zIndex: 10,
        flexDirection: "row",
        gap: 8,
    },
    iconButton: {
        backgroundColor: "rgba(255,255,255,0.8)",
        borderRadius: 15,
        padding: 8,
    },
    closeButton: {
        position: "absolute",
        top: 15,
        right: 15,
        zIndex: 10,
        padding: 5,
        backgroundColor: "rgba(255,255,255,0.8)",
        borderRadius: 15,
    },
    closeButtonText: {
        fontSize: 20,
        color: "#333",
        fontWeight: "bold",
    },
    restaurantImage: {
        width: "100%",
        height: 220,
    },
    scrollContent: {
        flex: 1,
    },
    contentArea: {
        padding: 20,
    },
    infoSection: {
        marginTop: 10,
    },
    restaurantName: {
        fontSize: 24,
        fontWeight: "900",
        fontFamily: "serif",
        color: "#000",
        marginBottom: 8,
    },
    infoRow: {
        fontSize: 14,
        color: "#000000ff",
        marginBottom: 4,
        fontWeight: "600",
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 6,
    },
    starIcon: {
        fontSize: 14,
        marginRight: 1,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        marginLeft: 6,
    },
    description: {
        fontSize: 12,
        color: "#666",
        lineHeight: 16,
    },
    historyText: {
        fontSize: 13,
        color: "#555",
        lineHeight: 18,
        marginBottom: 15,
        fontStyle: "italic",
    },
    actionButtonsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 15,
        padding: 15,
        paddingTop: 15,
    },
    tryAnotherButton: {
        flex: 1,
        backgroundColor: COLORS.highlightOrange,
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: "center",
    },
    selectButton: {
        flex: 1,
        backgroundColor: COLORS.main,
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: "center",
    },
    selectButtonContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    buttonText: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 16,
    },
});
