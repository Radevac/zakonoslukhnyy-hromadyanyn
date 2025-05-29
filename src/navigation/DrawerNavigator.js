import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CalendarScreen from '../screens/CalendarScreen';
import MapScreen from '../screens/MapScreen';
import { AuthContext } from '../context/AuthContext';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
    const { logout } = useContext(AuthContext);

    return (
        <Drawer.Navigator>
            <Drawer.Screen name="Календар" component={CalendarScreen} />
            <Drawer.Screen name="Карта" component={MapScreen} />
            <Drawer.Screen name="Налаштування" component={SettingsScreen} />
            <Drawer.Screen name="Вийти" component={() => { logout(); return null; }} />
        </Drawer.Navigator>
    );
}
