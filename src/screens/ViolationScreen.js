import React, { useState } from 'react';
import {
    View, Text, TextInput, Button, StyleSheet, Image, Alert, Linking
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useTasks } from '../context/TasksContext';
import { Picker } from "@react-native-picker/picker";
import { useTheme } from '../context/ThemeContext';

const ViolationScreen = () => {
    const navigation = useNavigation();
    const { addTask } = useTasks();
    const { theme, isDark } = useTheme();

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
            if (data.secure_url) return data.secure_url;

            Alert.alert('Upload failed', 'No URL returned');
            return null;
        } catch (err) {
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

        let cloudUrl = '';
        if (localImage) {
            cloudUrl = await uploadToCloudinary(localImage);
            if (!cloudUrl) {
                setUploading(false);
                return;
            }
        }

        const violationData = {
            description: description.trim(),
            category: category.trim(),
            geoLocation: coords,
            photoUrl: cloudUrl || '',
        };

        await addTask(today, violationData);

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
            Alert.alert('Backend error', 'Could not send post');
        }

        setUploading(false);
    };

    const dynamicStyles = styles(isDark);

    return (
        <View style={dynamicStyles.container}>
            <Text style={dynamicStyles.label}>Violation (today only)</Text>

            <TextInput
                style={dynamicStyles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="Description"
                placeholderTextColor={isDark ? '#aaa' : undefined}
            />

            <Text style={dynamicStyles.label}>Category</Text>
            <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                style={dynamicStyles.picker}
            >
                <Picker.Item label="Select category..." value="" />
                <Picker.Item label="Traffic Rules" value="traffic rules" />
                <Picker.Item label="Criminal" value="criminal" />
                <Picker.Item label="Administrative" value="administrative" />
                <Picker.Item label="Other" value="other" />
            </Picker>

            <TextInput
                style={dynamicStyles.input}
                value={geoLocation}
                onChangeText={setGeoLocation}
                placeholder="GeoLocation"
                placeholderTextColor={isDark ? '#aaa' : undefined}
            />

            {localImage && <Image source={{ uri: localImage }} style={dynamicStyles.image} />}

            <Button title="Take Photo" onPress={handleTakePhoto} />
            <Button title={uploading ? "Saving..." : "Save Violation"} onPress={handleSave} disabled={uploading} />
        </View>
    );
};

const styles = (isDark) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: isDark ? '#121212' : '#fff',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: isDark ? '#fff' : '#000',
    },
    input: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        color: isDark ? '#fff' : '#000',
        backgroundColor: isDark ? '#1e1e1e' : '#fff',
    },
    picker: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 5,
        marginBottom: 10,
        color: isDark ? '#fff' : '#000',
        backgroundColor: isDark ? '#1e1e1e' : '#fff',
    },
    image: {
        width: '100%',
        height: 200,
        marginVertical: 10,
        resizeMode: 'contain'
    }
});

export default ViolationScreen;
