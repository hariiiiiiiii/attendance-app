// LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const LoginScreen = ({ navigation }) => {
    const [usn, setUsn] = useState('');

    const handleLogin = () => {
        if (usn.trim() === '') {
            Alert.alert('Error', 'Please enter a valid USN');
            return;
        }
        navigation.navigate('AttendanceScreen', { usn });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter USN</Text>
            <TextInput 
                style={styles.input} 
                placeholder="USN" 
                placeholderTextColor="#aaa"
                value={usn} 
                onChangeText={setUsn} 
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#1e1e1e',
        color: '#fff',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#bb86fc',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export { LoginScreen };
