import React, { useEffect } from 'react';
import {
    View, Text, FlatList, Button, StyleSheet, TouchableOpacity
} from 'react-native';
import { useRoute, useNavigation, useIsFocused } from '@react-navigation/native';
import { useTasks } from '../context/TasksContext';
import { useTheme } from '../context/ThemeContext';

const TaskScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { date: dateString } = route.params;
    const date = new Date(dateString);
    const isFocused = useIsFocused();

    const { tasksByDate, fetchTasksFromBackendByDate, removeTask } = useTasks();
    const { isDark } = useTheme();
    const styles = getStyles(isDark);

    const key = date.toISOString().split('T')[0];
    const tasks = tasksByDate[key] || [];

    useEffect(() => {
        if (isFocused) {
            fetchTasksFromBackendByDate(date);
        }
    }, [isFocused]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Violations for {key}:</Text>

            {tasks.length === 0 ? (
                <Text style={styles.noTasks}>No violations for this day</Text>
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.taskRow}>
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={() =>
                                    navigation.navigate('TaskEditorScreen', {
                                        task: item,
                                        date: date.toISOString(),
                                    })
                                }
                            >
                                <Text style={styles.task}>{item.description || item.title}</Text>
                                <Text style={styles.taskDetail}>Category: {item.category || item.text}</Text>
                                <Text style={styles.taskDetail}>Geo: {item.geoLocation || `${item.latitude},${item.longitude}`}</Text>
                                <Text style={styles.taskDetail}>Author: {item.author || 'Unknown'}</Text>
                            </TouchableOpacity>

                            <View style={styles.buttons}>
                                <Button
                                    title="🗺️"
                                    onPress={() =>
                                        navigation.navigate('ViolationMap', {
                                            geoLocation: item.geoLocation || `${item.latitude},${item.longitude}`,
                                        })
                                    }
                                />
                                <Button title="🗑" onPress={() => removeTask(item.id || item._id, date)}/>
                            </View>
                        </View>
                    )}
                />
            )}

            <Button
                title="Add Violation"
                onPress={() => navigation.navigate('TaskEditorScreen', { date: date.toISOString() })}
            />

            <View style={styles.backButtonContainer}>
                <Button
                    title="Back to Calendar"
                    onPress={() => navigation.navigate('Main', { screen: 'Календар' })}
                />
            </View>
        </View>
    );
};

const getStyles = (isDark) =>
    StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: isDark ? '#121212' : '#fff',
        },
        title: {
            fontSize: 20,
            marginBottom: 10,
            color: isDark ? '#fff' : '#000',
        },
        noTasks: {
            fontSize: 16,
            color: isDark ? '#aaa' : '#888',
        },
        taskRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginVertical: 4,
        },
        task: {
            fontSize: 16,
            fontWeight: 'bold',
            color: isDark ? '#fff' : '#000',
        },
        taskDetail: {
            fontSize: 12,
            color: isDark ? '#ccc' : '#666',
        },
        buttons: {
            flexDirection: 'row',
        },
        backButtonContainer: {
            marginTop: 10,
            alignSelf: 'center',
            width: '100%',
        },
    });

export default TaskScreen;
