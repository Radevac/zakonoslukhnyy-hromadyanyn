import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

const MapScreen = () => {
    const mapRef = useRef(null);
    const [violations, setViolations] = useState([]);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        fetchViolations();
        getCurrentLocation();
    }, []);

    const fetchViolations = async () => {
        try {
            const res = await axios.get('http://192.168.0.105:3000/posts');
            const filtered = res.data.filter(post => post.latitude && post.longitude);
            setViolations(filtered);
        } catch (err) {
            console.error('Error fetching posts:', err);
        }
    };

    const getCurrentLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setUserLocation({ latitude, longitude });

        mapRef.current?.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
        }, 1000);
    };

    const recenterMap = () => {
        if (userLocation) {
            mapRef.current?.animateToRegion({
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }, 1000);
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: userLocation?.latitude || 48.3794,
                    longitude: userLocation?.longitude || 31.1656,
                    latitudeDelta: 10,
                    longitudeDelta: 10,
                }}
                showsUserLocation={true}
            >
                {violations.map((violation) => (
                    <Marker
                        key={violation.id}
                        coordinate={{
                            latitude: violation.latitude,
                            longitude: violation.longitude,
                        }}
                        title={violation.title}
                        description={violation.text}
                    />
                ))}
            </MapView>

            <TouchableOpacity style={styles.button} onPress={recenterMap}>
                <Text style={styles.buttonText}>📍 Моє місцезнаходження</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        flex: 1
    },
    button: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600'
    }
});

export default MapScreen;
