import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import axios from 'axios';

const AttendanceScreen = () => {
    const [usn, setUsn] = useState('');
    const [attendance, setAttendance] = useState(null);
    const [error, setError] = useState(null);

    const fetchAttendance = async () => {
        if (!usn) return;
        
        try {
            const response = await axios.get(`http://192.168.108.162:8000/attendance/${usn}`);
            console.log("Fetched data:", response.data);
            setAttendance(response.data);
            setError(null);  // Reset error if data is fetched successfully
        } catch (error) {
            console.error("Error fetching attendance:", error.response ? error.response.data : error.message);
            setError("Failed to load attendance.");
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <TextInput
                value={usn}
                onChangeText={setUsn}
                placeholder="Enter USN"
                style={{ padding: 10, borderWidth: 1, marginBottom: 20 }}
            />
            <Button title="Get Attendance" onPress={fetchAttendance} />
            
            {error && <Text style={{ color: 'red', marginTop: 20 }}>{error}</Text>}
            
            {attendance && !error && (
                <View style={{ marginTop: 20 }}>
                    <Text>Attendance Data for {attendance.studentId}:</Text>
                    {attendance.data ? (
                        <Text>{JSON.stringify(attendance.data, null, 2)}</Text>
                    ) : (
                        <Text>No attendance data available.</Text>
                    )}
                </View>
            )}
        </View>
    );
};

export default AttendanceScreen;
