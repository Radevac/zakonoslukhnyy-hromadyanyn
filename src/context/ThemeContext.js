import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

const lightTheme = {
    mode: 'light',
    background: '#ffffff',
    text: '#000000',
};

const darkTheme = {
    mode: 'dark',
    background: '#121212',
    text: '#ffffff',
};

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false);
    const theme = isDark ? darkTheme : lightTheme;

    const toggleTheme = async () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        await AsyncStorage.setItem('@theme', newTheme ? 'dark' : 'light');
    };

    const loadTheme = async () => {
        const saved = await AsyncStorage.getItem('@theme');
        if (saved === 'dark') setIsDark(true);
        else if (saved === 'light') setIsDark(false);
        else setIsDark(Appearance.getColorScheme() === 'dark');
    };

    useEffect(() => {
        loadTheme();
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
