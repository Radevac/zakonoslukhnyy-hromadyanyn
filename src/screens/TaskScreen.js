import React, { useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, useIsFocused } from '@react-navigation/native';
import { useTasks } from '../context/TasksContext';

const TaskScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { date: dateString } = route.params;
    const date = new Date(dateString);
    const { tasksByDate, loadTasks, removeTask } = useTasks();

    const isFocused = useIsFocused();
    const key = date.toISOString().split('T')[0];
    const tasks = tasksByDate[key] || [];

    useEffect(() => {
        if (isFocused) {
            console.log('TaskScreen: loadTasks called');
            loadTasks(date);
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
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('TaskEditor', { task: item, date: date.toISOString() })
                            }
                            style={styles.taskRow}
                        >
                            <View style={{ flex: 1 }}>
                                <Text style={styles.task}>{item.description}</Text>
                                <Text style={styles.taskDetail}>Category: {item.category}</Text>
                                <Text style={styles.taskDetail}>Geo: {item.geoLocation}</Text>
                            </View>
                            <Button title="🗑" onPress={() => removeTask(item.id, date)} />
                        </TouchableOpacity>
                    )}
                />
            )}

            <Button
                title="Add Violation"
                onPress={() => navigation.navigate('TaskEditorScreen', { date: date.toISOString() })}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 20, marginBottom: 10 },
    noTasks: { fontSize: 16, color: '#888' },
    taskRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4 },
    task: { fontSize: 16, fontWeight: 'bold' },
    taskDetail: { fontSize: 12, color: '#666' },
});

export default TaskScreen;
