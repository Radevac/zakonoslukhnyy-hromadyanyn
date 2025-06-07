import React from 'react';
import { View, Text, Button, StyleSheet, Switch } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const SettingsScreen = () => {
    const { logout } = useAuth();
    const { theme, toggleTheme, isDark } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

            <View style={styles.row}>
                <Text style={[styles.label, { color: theme.text }]}>Theme</Text>
                <Switch value={isDark} onValueChange={toggleTheme} />
            </View>

            <Button title="Logout" onPress={logout} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, marginBottom: 20 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    label: { fontSize: 16 },
});

export default SettingsScreen;
