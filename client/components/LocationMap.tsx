import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { COLORS } from "../constants/theme";

interface LocationMapProps {
    region: Region;
    onRegionChange?: (region: Region) => void;
    userLocation?: {
        latitude: number;
        longitude: number;
    } | null;
}

export default function LocationMap({
    region,
    onRegionChange,
    userLocation,
}: LocationMapProps) {
    return (
        <View style={styles.mapContainer}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={region}
                onRegionChangeComplete={onRegionChange}
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
    );
}

const styles = StyleSheet.create({
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
});
