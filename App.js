import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { TasksProvider } from './src/context/TasksContext';
import { ThemeProvider } from './src/context/ThemeContext';
import RootNavigator from './src/navigation/RootNavigator';
import { initDB } from './src/database/database';
import './src/i18n';

export default function App() {
    useEffect(() => {
        initDB();
    }, []);

    return (
        <AuthProvider>
            <TasksProvider>
                <ThemeProvider>
                    <NavigationContainer>
                        <RootNavigator />
                    </NavigationContainer>
                </ThemeProvider>
            </TasksProvider>
        </AuthProvider>
    );
}
