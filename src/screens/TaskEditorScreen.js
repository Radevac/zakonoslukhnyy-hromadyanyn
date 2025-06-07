import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTasks } from '../context/TasksContext';

const TaskEditorScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { addTask, editTask } = useTasks();
    const { date: dateString, task } = route.params || {};
    const date = new Date(dateString);

    const [description, setDescription] = useState(task ? task.description : '');
    const [category, setCategory] = useState(task ? task.category : '');
    const [geoLocation, setGeoLocation] = useState(task ? task.geoLocation : '');

    const handleSave = async () => {
        if (!description.trim()) return;

        const violationData = {
            description: description.trim(),
            category: category.trim(),
            geoLocation: geoLocation.trim(),
        };

        if (task) {
            await editTask(task.id, violationData, date);
        } else {
            await addTask(date, violationData);
        }
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {task ? 'Edit Violation' : `New Violation for ${date.toISOString().split('T')[0]}`}
            </Text>

            <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="Description"
            />

            <TextInput
                style={styles.input}
                value={category}
                onChangeText={setCategory}
                placeholder="Category"
            />

            <TextInput
                style={styles.input}
                value={geoLocation}
                onChangeText={setGeoLocation}
                placeholder="GeoLocation"
            />

            <Button title="Save" onPress={handleSave} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    label: { fontSize: 16, marginBottom: 10 },
    input: { borderWidth: 1, borderColor: '#aaa', borderRadius: 5, padding: 10, marginBottom: 20 },
});

export default TaskEditorScreen;
