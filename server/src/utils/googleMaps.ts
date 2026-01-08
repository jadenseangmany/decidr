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

    console.log("[Google Maps] Calling Distance Matrix API...");
    console.log("[Google Maps] Origin:", origin);
    console.log("[Google Maps] Destination:", destination);

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

        console.log("[Google Maps] Response status:", response.data?.status);
        console.log("[Google Maps] Full response:", JSON.stringify(response.data, null, 2));

        const element = response.data?.rows?.[0]?.elements?.[0];

        if (element?.status === "OK" && element?.duration?.value) {
            const minutes = Math.round(element.duration.value / 60);
            console.log("[Google Maps] Driving time:", minutes, "minutes");
            return minutes;
        }

        console.warn("[Google Maps] No valid duration in response. Element:", element);
        return null;
    } catch (error) {
        console.error("Google Maps API error:", error);
        return null;
    }
};
