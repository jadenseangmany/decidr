import axios from "axios";

const DISTANCE_MATRIX_URL =
    "https://maps.googleapis.com/maps/api/distancematrix/json";

interface Coordinates {
    latitude: number;
    longitude: number;
}

/**
 * Get estimated driving time in minutes using Google Maps Distance Matrix API.
 * @returns driving time in minutes, or null if unavailable
 */
export const getDrivingTime = async (
    origin: Coordinates,
    destination: Coordinates
): Promise<number | null> => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        console.warn("GOOGLE_MAPS_API_KEY not configured, skipping driving time");
        return null;
    }

    try {
        const response = await axios.get(DISTANCE_MATRIX_URL, {
            params: {
                key: apiKey,
                origins: `${origin.latitude},${origin.longitude}`,
                destinations: `${destination.latitude},${destination.longitude}`,
                mode: "driving",
                units: "imperial",
            },
        });

        const element = response.data?.rows?.[0]?.elements?.[0];

        if (element?.status === "OK" && element?.duration?.value) {
            // duration.value is in seconds, convert to minutes
            return Math.round(element.duration.value / 60);
        }

        return null;
    } catch (error) {
        console.error("Google Maps API error:", error);
        return null;
    }
};
