import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CalendarScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Календар з задачами (todo)</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 20 },
});
