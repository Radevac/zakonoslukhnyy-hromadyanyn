import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TaskScreen from '../screens/TaskScreen';
import TaskEditorScreen from '../screens/TaskEditorScreen';

import DrawerNavigator from './DrawerNavigator';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    const { user } = useAuth();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
                <>
                    <Stack.Screen name="Main" component={DrawerNavigator} />
                    <Stack.Screen name="TaskScreen" component={TaskScreen} />
                    <Stack.Screen name="TaskEditorScreen" component={TaskEditorScreen} />
                </>
            ) : (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </>
            )}
        </Stack.Navigator>
    );
};

export default RootNavigator;
