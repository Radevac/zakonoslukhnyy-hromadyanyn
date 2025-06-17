import React from 'react';
import { View, Text, Button, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

import { changeLanguage } from '../i18n';
import { useTranslation } from 'react-i18next';

const SettingsScreen = () => {
    const { logout } = useAuth();
    const { theme, toggleTheme, isDark } = useTheme();
    const { i18n, t } = useTranslation();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

            <View style={styles.row}>
                <Text style={[styles.label, { color: theme.text }]}>Theme</Text>
                <Switch value={isDark} onValueChange={toggleTheme} />
            </View>
            <TouchableOpacity style={styles.langButton} onPress={() => changeLanguage(i18n.language === 'uk' ? 'en' : 'uk')}>
                <Text style={styles.langButtonText}>
                    {i18n.language === 'uk' ? t('english') : t('ukraine')}
                </Text>
            </TouchableOpacity>

            <Button title="Logout" onPress={logout} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    title: {
        fontSize: 24,
        marginBottom: 20
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    label: {
        fontSize: 16
    },
    langButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center',
    },

    langButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
});

export default SettingsScreen;
