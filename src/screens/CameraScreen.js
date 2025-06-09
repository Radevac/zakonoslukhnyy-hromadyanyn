import React, { useState, useEffect } from 'react';
import {
    Alert,
    Button,
    Image,
    Linking,
    StyleSheet,
    View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CameraScreen = () => {
    const [image, setImage] = useState();

    useEffect(() => {
        const loadSavedImage = async () => {
            try {
                const savedUrl = await AsyncStorage.getItem('uploadedImageUrl');
                if (savedUrl) {
                    setImage(savedUrl);
                }
            } catch (e) {
                console.error('Failed to load image URL:', e);
            }
        };

        loadSavedImage();
    }, []);

    const handlePickImage = async () => {
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
                return;
            }
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
            allowsEditing: false,
            allowsMultipleSelection: false,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleTakePhoto = async () => {
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
                return;
            }
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: 'Images',
            allowsEditing: false,
            allowsMultipleSelection: false,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSavePhoto = async () => {
        if (!image) return;

        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permission required',
                'Sorry, we need camera roll permissions to make this work! You can enable it in Settings.'
            );
            return;
        }

        try {
            await MediaLibrary.saveToLibraryAsync(image);
            Alert.alert('Photo saved!');
        } catch (e) {
            console.log('Save error:', e);
            Alert.alert('Save error:', e.message);
        }
    };

    const handleUploadImage = async () => {
        if (!image) {
            Alert.alert('No image selected', 'Please pick an image first!');
            return;
        }

        const formData = new FormData();
        formData.append('file', {
            uri: image,
            name: 'upload.jpg',
            type: 'image/jpeg',
        });
        formData.append('upload_preset', 'project_photo'); // заміни на свій upload_preset

        try {
            const response = await fetch(
                'https://api.cloudinary.com/v1_1/di7tdnp2a/image/upload', // заміни на свій cloud_name
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data = await response.json();
            if (data.secure_url) {
                console.log('Uploaded Image URL:', data.secure_url);
                await AsyncStorage.setItem('uploadedImageUrl', data.secure_url);
                setImage(data.secure_url);
                Alert.alert('Upload successful!', 'Image uploaded to Cloudinary.');
            } else {
                console.error(data);
                Alert.alert('Upload failed', 'Something went wrong during upload.');
            }
        } catch (error) {
            console.error('Upload error:', error);
            Alert.alert('Upload error', error.message);
        }
    };

    const handleClearImage = async () => {
        await AsyncStorage.removeItem('uploadedImageUrl');
        setImage(undefined);
    };

    return (
        <View style={styles.container}>
            <Button title="Pick an image from gallery" onPress={handlePickImage} />
            <Button title="Take a photo" onPress={handleTakePhoto} />

            {image && <Image source={{ uri: image }} style={styles.image} />}

            <Button title="Save Photo" onPress={handleSavePhoto} />
            <Button title="Upload to Cloudinary" onPress={handleUploadImage} />
            <Button title="Clear Saved Image" onPress={handleClearImage} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    image: {
        width: 300,
        height: 300,
        marginVertical: 20,
        resizeMode: 'contain',
    },
});

export default CameraScreen;
