import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Image,
    Alert,
    Linking
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTasks } from '../context/TasksContext';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const TaskEditorScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { addTask, editTask } = useTasks();
    const { date: dateString, task } = route.params || {};
    const date = new Date(dateString);

    const [description, setDescription] = useState(task?.description || '');
    const [category, setCategory] = useState(task?.category || '');
    const [geoLocation, setGeoLocation] = useState(task?.geoLocation || '');
    const [photoUrl, setPhotoUrl] = useState(task?.photoUrl || '');
    const [localImage, setLocalImage] = useState(null);

    const requestMediaLibraryPermission = async () => {
        const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (newStatus !== 'granted') {
                Alert.alert(
                    'Permission required',
                    'Sorry, we need camera roll permissions to make this work! You can enable it in Settings.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() },
                    ]
                );
                return false;
            }
        }
        return true;
    };

    const requestCameraPermission = async () => {
        const { status } = await ImagePicker.getCameraPermissionsAsync();
        if (status !== 'granted') {
            const { status: newStatus } = await ImagePicker.requestCameraPermissionsAsync();
            if (newStatus !== 'granted') {
                Alert.alert(
                    'Permission required',
                    'Sorry, we need camera permissions to make this work! You can enable it in Settings.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() },
                    ]
                );
                return false;
            }
        }
        return true;
    };

    const handlePickImage = async () => {
        const hasPermission = await requestMediaLibraryPermission();
        if (!hasPermission) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            setLocalImage(result.assets[0].uri);
        }
    };

    const handleTakePhoto = async () => {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) return;

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: 'Images',
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            setLocalImage(result.assets[0].uri);
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
            const res = await fetch('https://api.cloudinary.com/v1_1/di7tdnp2a/image/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (data.secure_url) {
                return data.secure_url;
            } else {
                Alert.alert('Cloudinary error', 'Upload failed.');
                return null;
            }
        } catch (err) {
            Alert.alert('Upload error', err.message);
            return null;
        }
    };

    const sendPostToBackend = async (photo, coords) => {
        try {
            const token = await AsyncStorage.getItem('@token');
            if (!token) {
                Alert.alert('Error', 'You are not logged in');
                return;
            }

            const [lat, lon] = coords.split(',').map(Number);

            await axios.post('http://192.168.0.105:3000/posts', {
                title: description,
                text: category,
                image: photo,
                latitude: lat,
                longitude: lon
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Could not create post');
        }
    };

    const handleSave = async () => {
        if (!description.trim()) {
            Alert.alert('Error', 'Please enter a description!');
            return;
        }

        let coords = geoLocation;

        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Location access is needed');
                return;
            }
            const currentLocation = await Location.getCurrentPositionAsync({});
            coords = `${currentLocation.coords.latitude},${currentLocation.coords.longitude}`;
            setGeoLocation(coords);
        } catch (e) {
            Alert.alert('Location error', 'Could not get current location');
            return;
        }

        let finalPhotoUrl = photoUrl;
        if (localImage) {
            const uploaded = await uploadToCloudinary(localImage);
            if (!uploaded) return;
            finalPhotoUrl = uploaded;
            setPhotoUrl(uploaded);
        }

        const violationData = {
            description: description.trim(),
            category: category.trim(),
            geoLocation: coords.trim(),
            photoUrl: finalPhotoUrl || '',
        };

        if (task) {
            await editTask(task.id, violationData, date);
        } else {
            await addTask(date, violationData);
        }

        await sendPostToBackend(finalPhotoUrl, coords);

        Alert.alert('Success', 'Violation saved successfully!');
        navigation.goBack();
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

            {localImage || photoUrl ? (
                <Image
                    source={{ uri: localImage || photoUrl }}
                    style={styles.image}
                />
            ) : (
                <Text style={styles.noImage}>No photo selected</Text>
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
