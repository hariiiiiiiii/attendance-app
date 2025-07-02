import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import {
  Text,
  Button,
  Spinner,
  Card,
  Layout,
  Toggle,
  useTheme,
} from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const AttendanceScreen = ({ route, navigation, toggleTheme, theme: currentTheme }) => {
  const { usn } = route.params;
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const fetchAttendance = () => {
    setLoading(true);
    axios
      .get(`http://192.168.119.159:8000/attendance/${usn}`)
      .then((response) => {
        console.log('API response:', response.data);  // For debugging
        setAttendance(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching attendance:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAttendance();
  }, [usn]);

  const calculatePercentage = (attended, total) => {
    return total > 0 ? ((attended / total) * 100).toFixed(2) : '0.00';
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Layout style={styles.loadingContainer}>
          <Spinner size="large" />
          <Text style={{ marginTop: 12 }} status="primary">
            Loading...
          </Text>
        </Layout>
      </SafeAreaView>
    );
  }

  if (!attendance) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Layout style={styles.loadingContainer}>
          <Text status="danger">No data available.</Text>
        </Layout>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme['background-basic-color-1'] },
        ]}
      >
        <View style={styles.toggleWrapper}>
          <Toggle checked={currentTheme === 'dark'} onChange={toggleTheme} status="primary">
            {currentTheme === 'dark' ? 'Dark' : 'Light'}
          </Toggle>
        </View>

        <Text category="h5" style={[styles.usnText, { color: theme['text-basic-color'] }]}>
          USN: {usn}
        </Text>

        <View style={styles.list}>
          {(attendance.data?.subjects || []).map((subject, index) => {
            const percentage = calculatePercentage(
              subject.attendedClasses,
              subject.totalClasses
            );
            const color =
              percentage < 75
                ? theme['color-danger-500']
                : theme['color-success-500'];

            return (
              <Card
                key={index}
                style={[styles.card, { backgroundColor: theme['background-basic-color-2'] }]}
              >
                <Text category="s1" style={{ marginBottom: 4, color: theme['text-basic-color'] }}>
                  {subject.name}
                </Text>
                <Text style={{ color, fontWeight: '700', fontSize: 18 }}>
                  {percentage}%
                </Text>
                <Text appearance="hint" category="c1">
                  {subject.attendedClasses} / {subject.totalClasses} classes attended
                </Text>
              </Card>
            );
          })}
        </View>

        <View style={styles.buttonsContainer}>
          <Button style={styles.button} onPress={fetchAttendance} status="info">
            Refresh
          </Button>
          <Button
            style={styles.button}
            onPress={() => navigation.navigate('AnalyticsScreen', { usn })}
            status="success"
          >
            View Analytics
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
  },
  container: {
    padding: 16,
    flexGrow: 1,
  },
  toggleWrapper: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  usnText: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  list: {
    marginBottom: 24,
  },
  card: {
    marginBottom: 12,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 6,
  },
});

export default AttendanceScreen;
