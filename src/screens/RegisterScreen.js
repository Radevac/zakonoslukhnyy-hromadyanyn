import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
    const { register } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            await register(username, password);
            navigation.goBack();
        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>

            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <Button title="Register" onPress={handleRegister} />

            <Text style={styles.link} onPress={() => navigation.goBack()}>
                Already have an account? Login here!
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    input: { borderWidth: 1, borderColor: '#aaa', borderRadius: 5, padding: 10, marginBottom: 10 },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    link: { marginTop: 10, color: 'blue', textAlign: 'center' },
});

export default RegisterScreen;
