import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from './Header';
import Day from './Day';
import { generateMonthMatrix } from '../utils/dateUtils';
import { useTasks } from '../context/TasksContext';
import { useNavigation } from '@react-navigation/native';

const Calendar = () => {
    const navigation = useNavigation();
    const { tasksByDate } = useTasks();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleDayPress = (selectedDate) => {
        navigation.navigate('TaskScreen', { date: selectedDate.toISOString() });
    };

    const hasTasks = (date) => {
        const key = date.toISOString().split('T')[0];
        return tasksByDate[key] && tasksByDate[key].length > 0;
    };

    const isToday = (date) => new Date().toDateString() === date.toDateString();
    const monthMatrix = generateMonthMatrix(currentDate);

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <View style={styles.container}>
            <View style={styles.clockContainer}>
                <Text style={styles.clockText}>{currentTime.toLocaleTimeString('en-GB')}</Text>
                <Text style={styles.dateText}>
                    {currentTime.toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    })}
                </Text>
            </View>
            <View style={styles.divider} />

            <Header
                date={currentDate}
                onPrev={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                onNext={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            />

            <View style={styles.weekDaysRow}>
                {weekDays.map((day, index) => (
                    <Text key={index} style={styles.weekDay}>{day}</Text>
                ))}
            </View>

            <View style={styles.grid}>
                {monthMatrix.map((week, i) => (
                    <View key={i} style={styles.row}>
                        {week.map((dayObj, j) => (
                            <Day
                                key={j}
                                dayObj={dayObj}
                                onPress={() => handleDayPress(dayObj.date)}
                                isToday={isToday(dayObj.date)}
                                hasTasks={hasTasks(dayObj.date)}
                            />
                        ))}
                    </View>
                ))}
                <View style={styles.divider} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212', padding: 16 },
    clockContainer: { alignItems: 'flex-start', marginBottom: 10, paddingLeft: 10 },
    clockText: { fontSize: 42, fontWeight: 'bold', color: '#ffffff' },
    dateText: { fontSize: 18, color: '#cccccc' },
    weekDaysRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 6 },
    weekDay: { color: '#aaaaaa', fontSize: 16, fontWeight: 'bold', width: 42, textAlign: 'center' },
    grid: { marginTop: 8 },
    row: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 6 },
    divider: { height: 1, backgroundColor: '#555', marginVertical: 8 },
});

export default Calendar;
