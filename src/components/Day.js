import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Day = ({ dayObj, onPress, isToday, hasTasks }) => {
    const { date, isCurrentMonth } = dayObj;
    const dayNumber = date.getDate();

    return (
        <TouchableOpacity
            style={[
                styles.dayContainer,
                !isCurrentMonth && styles.otherMonth,
                isToday && styles.today,
            ]}
            onPress={onPress}
        >
            <Text style={styles.dayText}>{dayNumber}</Text>
            {hasTasks && <Text style={styles.dot}>•</Text>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    dayContainer: {
        width: 42,
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 21
    },
    dayText: {
        color: '#ffffff'
    },
    otherMonth: {
        opacity: 0.3
    },
    today: {
        borderWidth: 1,
        borderColor: '#ffffff',
        borderRadius: 21
    },
    dot: {
        fontSize: 10,
        color: '#00ff00'
    },
});

export default Day;
