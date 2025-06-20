import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.0.105:3000';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const saveToken = async (t) => {
        await AsyncStorage.setItem('@token', t);
        setToken(t);
        axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    };

    const register = async (username, password) => {
        await axios.post(`${API_URL}/auth/register`, { username, password });
        await login(username, password);
    };

    const login = async (username, password) => {
        const res = await axios.post(`${API_URL}/auth/login`, { username, password });
        await saveToken(res.data.token);
        setUser({ username });
    };

    const logout = async () => {
        await AsyncStorage.removeItem('@token');
        setUser(null);
        setToken(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    const loginAsGuest = () => {
        setUser({ guest: true });
        setToken(null);
    };

    const loadToken = async () => {
        const savedToken = await AsyncStorage.getItem('@token');
        if (savedToken) {
            await saveToken(savedToken);
        }
    };

    useEffect(() => {
        loadToken();
    }, []);

    return (
        <AuthContext.Provider value={{ user, register, login, logout, loginAsGuest }}>
            {children}
        </AuthContext.Provider>
    );
};
