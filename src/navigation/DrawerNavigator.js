import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import CalendarScreen from '../screens/CalendarScreen';
import MapScreen from '../screens/MapScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CameraScreen from '../screens/CameraScreen';

import { useAuth } from '../context/AuthContext';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
    const { logout } = useAuth();

    return (
        <Drawer.Navigator>
            <Drawer.Screen name="Календар" component={CalendarScreen} />
            <Drawer.Screen name="Камера" component={CameraScreen} />
            <Drawer.Screen name="Карта" component={MapScreen} />
            <Drawer.Screen name="Налаштування" component={SettingsScreen} />
            <Drawer.Screen
                name="Вихід"
                component={() => {
                    logout();
                    return null;
                }}
                options={{ headerShown: false }}
            />
        </Drawer.Navigator>
    );
}
