import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useTasks } from '../context/TasksContext';

const MapScreen = () => {
    const { tasksByDate } = useTasks();
    const [violations, setViolations] = useState([]);

    useEffect(() => {
        const allViolations = [];
        Object.keys(tasksByDate).forEach((dateKey) => {
            tasksByDate[dateKey].forEach((task) => {
                if (task.geoLocation) {
                    allViolations.push(task);
                }
            });
        });
        setViolations(allViolations);
    }, [tasksByDate]);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 48.3794,
                    longitude: 31.1656,
                    latitudeDelta: 10,
                    longitudeDelta: 10,
                }}
            >
                {violations.map((violation) => {
                    const [lat, lon] = violation.geoLocation.split(',').map(Number);
                    return (
                        <Marker
                            key={violation.id}
                            coordinate={{ latitude: lat, longitude: lon }}
                            title={violation.description}
                            description={violation.category}
                        />
                    );
                })}
            </MapView>
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
});

export default MapScreen;
