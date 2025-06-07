import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Header = ({ date, onPrev, onNext }) => {
    const monthName = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={onPrev}>
                <Text style={styles.arrow}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.headerText}>{monthName} {year}</Text>
            <TouchableOpacity onPress={onNext}>
                <Text style={styles.arrow}>{'>'}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    headerText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
    arrow: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', paddingHorizontal: 10 },
});

export default Header;
