import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const register = async (username, password) => {
        const usersRaw = await AsyncStorage.getItem('@users');
        const users = usersRaw ? JSON.parse(usersRaw) : {};

        if (users[username]) {
            throw new Error('User already exists');
        }

        const newUser = { id: uuidv4(), password };
        users[username] = newUser;

        await AsyncStorage.setItem('@users', JSON.stringify(users));
        await AsyncStorage.setItem('@currentUser', JSON.stringify({ username, id: newUser.id }));
        setUser({ username, id: newUser.id });
    };

    const login = async (username, password) => {
        const usersRaw = await AsyncStorage.getItem('@users');
        const users = usersRaw ? JSON.parse(usersRaw) : {};

        const existing = users[username];
        if (!existing || existing.password !== password) {
            throw new Error('Invalid username or password');
        }

        await AsyncStorage.setItem('@currentUser', JSON.stringify({ username, id: existing.id }));
        setUser({ username, id: existing.id });
    };

    const logout = async () => {
        await AsyncStorage.removeItem('@currentUser');
        setUser(null);
    };

    const loadCurrentUser = async () => {
        const current = await AsyncStorage.getItem('@currentUser');
        if (current) {
            setUser(JSON.parse(current));
        }
    };

    useEffect(() => {
        loadCurrentUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
