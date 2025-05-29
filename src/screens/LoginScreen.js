import React, { useContext, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Увійти</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <Button title="Увійти" onPress={() => login(email)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    input: { borderWidth: 1, padding: 10, marginBottom: 20 },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
});
