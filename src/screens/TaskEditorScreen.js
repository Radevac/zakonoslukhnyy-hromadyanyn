import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert, Linking } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTasks } from '../context/TasksContext';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

const TaskEditorScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { addTask, editTask } = useTasks();
    const { date: dateString, task } = route.params || {};
    const date = new Date(dateString);

    const [description, setDescription] = useState(task ? task.description : '');
    const [category, setCategory] = useState(task ? task.category : '');
    const [geoLocation, setGeoLocation] = useState(task ? task.geoLocation : '');
    const [photoUrl, setPhotoUrl] = useState(task ? task.photoUrl : '');

    useEffect(() => {
        const getLocation = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
            const currentLocation = await Location.getCurrentPositionAsync({});
            const coords = `${currentLocation.coords.latitude}, ${currentLocation.coords.longitude}`;
            setGeoLocation(coords);
        };

        getLocation();
    }, []);

    const handleSave = async () => {
        if (!description.trim()) {
            Alert.alert('Error', 'Please enter a description!');
            return;
        }

        const violationData = {
            description: description.trim(),
            category: category.trim(),
            geoLocation: geoLocation.trim(),
            photoUrl: photoUrl || '',
        };

        if (task) {
            await editTask(task.id, violationData, date);
        } else {
            await addTask(date, violationData);
        }

        Alert.alert('Success', 'Violation saved successfully!');
        navigation.goBack();
    };

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permission required',
                'We need gallery permissions to pick an image!',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => Linking.openSettings() },
                ]
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            await uploadToCloudinary(result.assets[0].uri);
        }
    };

    const handleTakePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permission required',
                'We need camera permissions!',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => Linking.openSettings() },
                ]
            );
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: 'Images',
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            await uploadToCloudinary(result.assets[0].uri);
        }
    };

    const uploadToCloudinary = async (photoUri) => {
        const formData = new FormData();
        formData.append('file', {
            uri: photoUri,
            name: 'violation.jpg',
            type: 'image/jpeg',
        });
        formData.append('upload_preset', 'project_photo');

        try {
            const response = await fetch(
                'https://api.cloudinary.com/v1_1/di7tdnp2a/image/upload',
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data = await response.json();
            if (data.secure_url) {
                console.log('Uploaded Image URL:', data.secure_url);
                setPhotoUrl(data.secure_url);
                Alert.alert('Upload successful!', 'Image uploaded to Cloudinary.');
            } else {
                console.error(data);
                Alert.alert('Upload failed', 'Something went wrong.');
            }
        } catch (error) {
            console.error('Upload error:', error);
            Alert.alert('Upload error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Violation for {date.toISOString().split('T')[0]}</Text>

            <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="Description"
            />

            <Text style={styles.label}>Category</Text>
            <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Select category..." value="" />
                <Picker.Item label="Traffic Rules" value="traffic rules" />
                <Picker.Item label="Criminal" value="criminal" />
                <Picker.Item label="Administrative" value="administrative" />
                <Picker.Item label="Other" value="other" />
            </Picker>

            <TextInput
                style={styles.input}
                value={geoLocation}
                onChangeText={setGeoLocation}
                placeholder="GeoLocation"
            />

            {photoUrl ? (
                <Image source={{ uri: photoUrl }} style={styles.image} />
            ) : (
                <Text style={styles.noImage}>No photo attached</Text>
            )}

            <Button title="Pick from Gallery" onPress={handlePickImage} />
            <Button title="Take Photo" onPress={handleTakePhoto} />
            <Button title="Save Violation" onPress={handleSave} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    label: {
        fontSize: 16,
        marginBottom: 5
    },
    input: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    },
    picker: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 5,
        marginBottom: 10
    },
    image: {
        width: '100%',
        height: 200,
        marginVertical: 10,
        resizeMode: 'contain'
    },
    noImage: {
        textAlign: 'center',
        marginVertical: 10,
        color: '#888'
    },
});

export default TaskEditorScreen;
