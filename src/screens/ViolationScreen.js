import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useTasks } from '../context/TasksContext';
import {Picker} from "@react-native-picker/picker";

const ViolationScreen = () => {
    const navigation = useNavigation();
    const { addTask } = useTasks();

    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [geoLocation, setGeoLocation] = useState('');
    const [localImage, setLocalImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const handleTakePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission denied', 'Please enable camera access.');
            return;
        }

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
                Alert.alert('Upload failed', 'No URL returned');
                return null;
            }
        } catch (err) {
            console.error('Cloudinary error:', err);
            Alert.alert('Error uploading', err.message);
            return null;
        }
    };

    const handleSave = async () => {
        if (!description.trim()) {
            Alert.alert('Error', 'Please enter a description.');
            return;
        }

        setUploading(true);

        // 1. Get location
        let coords = geoLocation;
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Location access is needed');
                setUploading(false);
                return;
            }
            const currentLocation = await Location.getCurrentPositionAsync({});
            coords = `${currentLocation.coords.latitude},${currentLocation.coords.longitude}`;
            setGeoLocation(coords);
        } catch (e) {
            Alert.alert('Location error', 'Could not get current location');
            setUploading(false);
            return;
        }

        // 2. Upload photo
        let cloudUrl = '';
        if (localImage) {
            cloudUrl = await uploadToCloudinary(localImage);
            if (!cloudUrl) {
                setUploading(false);
                return;
            }
        }

        // 3. Save locally
        const violationData = {
            description: description.trim(),
            category: category.trim(),
            geoLocation: coords,
            photoUrl: cloudUrl || '',
        };

        await addTask(today, violationData);

        // 4. Send to backend
        try {
            const token = await AsyncStorage.getItem('@token');
            const [lat, lon] = coords.split(',').map(Number);

            await axios.post('http://192.168.0.105:3000/posts', {
                title: description,
                text: category,
                image: cloudUrl,
                latitude: lat,
                longitude: lon
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            Alert.alert('Success', 'Violation saved and sent.');
            navigation.goBack();
        } catch (e) {
            console.error(e);
            Alert.alert('Backend error', 'Could not send post');
        }

        setUploading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Violation (today only)</Text>

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

            {localImage && <Image source={{ uri: localImage }} style={styles.image} />}

            <Button title="Take Photo" onPress={handleTakePhoto} />
            <Button title={uploading ? "Saving..." : "Save Violation"} onPress={handleSave} disabled={uploading} />
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
    image: {
        width: '100%',
        height: 200,
        marginVertical: 10,
        resizeMode: 'contain'
    }
});

export default ViolationScreen;
