import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const user = await AsyncStorage.getItem('user');
            setIsLoggedIn(!!user);
        };
        checkLoginStatus();
    }, []);

    const login = async (email) => {
        await AsyncStorage.setItem('user', JSON.stringify({ email }));
        setIsLoggedIn(true);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('user');
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
