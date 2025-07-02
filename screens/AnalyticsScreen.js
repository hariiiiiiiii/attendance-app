import React, { useEffect, useState } from 'react';
import { ScrollView, Dimensions, View } from 'react-native';
import { Layout, Text, Spinner, useTheme, Toggle } from '@ui-kitten/components';
import { BarChart } from 'react-native-chart-kit';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen({ route, toggleTheme, theme: currentTheme }) {
  const { usn } = route.params;
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState(null);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    setLoading(true);
    setError(null);
    setAttendanceData(null);

    fetch(`http://192.168.119.159:8000/attendance/${usn}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setAttendanceData(data.data);
        } else {
          setError('No attendance data found.');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch attendance data.');
        setLoading(false);
      });
  }, [usn]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Spinner size="large" />
          <Text style={{ marginTop: 12, color: theme['text-basic-color'] }}>Loading...</Text>
        </Layout>
      </SafeAreaView>
    );
  }

  if (error || !attendanceData || !Array.isArray(attendanceData.subjects)) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: theme['text-basic-color'] }}>{error || 'No attendance data available.'}</Text>
        </Layout>
      </SafeAreaView>
    );
  }

  const subjects = attendanceData.subjects;

  const wrapLabel = (label) => {
    if (!label) return '';
    const maxCharsPerLine = 6;
    const matches = label.match(new RegExp(`.{1,${maxCharsPerLine}}`, 'g'));
    return matches ? matches.join('\n') : label;
  };

  const labels = subjects.map(sub => wrapLabel(sub.name));
  const percentages = subjects.map(sub =>
    sub.totalClasses > 0 ? Math.round((sub.attendedClasses / sub.totalClasses) * 100) : 0
  );

  const monthlyAttendance = attendanceData.monthlyAttendance || attendanceData.monthly || {};
  const markedDates = {};
  Object.entries(monthlyAttendance).forEach(([date, present]) => {
    markedDates[date] = {
      dots: [
        {
          key: present ? 'present' : 'absent',
          color: present ? theme['color-success-500'] : theme['color-danger-500'],
        },
      ],
    };
  });

  const chartConfig = {
    backgroundGradientFrom: theme['background-basic-color-1'],
    backgroundGradientTo: theme['background-basic-color-1'],
    decimalPlaces: 0,
    color: (opacity = 1) => {
      return currentTheme === 'dark'
        ? `rgba(255, 255, 255, ${opacity})`
        : `rgba(0, 0, 0, ${opacity})`;
    },
    labelColor: (opacity = 1) =>
      currentTheme === 'dark'
        ? `rgba(255, 255, 255, ${opacity})`
        : `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 16 },
    propsForBackgroundLines: {
      stroke: currentTheme === 'dark' ? '#444' : '#ccc',
    },
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: 16,
          paddingVertical: 20,
          backgroundColor: theme['background-basic-color-1'],
        }}
      >
        <View style={{ alignItems: 'flex-end', marginBottom: 8 }}>
          <Toggle checked={currentTheme === 'dark'} onChange={toggleTheme} status="primary">
            {currentTheme === 'dark' ? 'Dark' : 'Light'}
          </Toggle>
        </View>

        <Text
          category="h5"
          style={{
            marginBottom: 16,
            fontWeight: 'bold',
            textAlign: 'center',
            color: theme['text-basic-color'],
          }}
        >
          Attendance Analytics for {usn}
        </Text>

        <Text category="s1" style={{ marginBottom: 8, color: theme['text-basic-color'] }}>
          Subject-wise Attendance %
        </Text>

        <Layout
          style={{
            borderRadius: 16,
            paddingVertical: 12,
            backgroundColor: 'transparent',
            marginBottom: 32,
          }}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {labels.length > 0 && percentages.length > 0 ? (
              <BarChart
                data={{
                  labels,
                  datasets: [{ data: percentages }],
                }}
                width={Math.max(labels.length * 80, screenWidth)}
                height={220}
                yAxisSuffix="%"
                chartConfig={chartConfig}
                style={{ borderRadius: 16 }}
                fromZero
                showValuesOnTopOfBars
                verticalLabelRotation={0}
              />
            ) : (
              <Text style={{ color: theme['text-basic-color'], textAlign: 'center' }}>
                No attendance data to display in chart.
              </Text>
            )}
          </ScrollView>
        </Layout>

        <Text category="s1" style={{ marginBottom: 8, color: theme['text-basic-color'] }}>
          Attendance Calendar (Present/Absent)
        </Text>

        <Calendar
          markingType={'multi-dot'}
          markedDates={markedDates}
          theme={{
            calendarBackground: theme['background-basic-color-1'],
            dayTextColor: theme['text-basic-color'],
            monthTextColor: theme['color-primary-500'],
            todayTextColor: theme['color-primary-500'],
            arrowColor: theme['color-primary-500'],
            textSectionTitleColor: theme['text-hint-color'],
            selectedDayBackgroundColor: theme['color-primary-500'],
            selectedDayTextColor: '#fff',
            dotColor: theme['color-primary-500'],
            textDisabledColor: theme['text-disabled-color'],
          }}
          style={{
            borderRadius: 10,
            overflow: 'hidden',
            marginBottom: 20,
          }}
        />

        {/* Legend */}
        <Layout
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 24,
            marginTop: 12,
            backgroundColor: 'transparent',
          }}
        >
          <Layout
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: 'transparent',
            }}
          >
            <Layout
              style={{
                width: 16,
                height: 16,
                backgroundColor: theme['color-success-500'],
                borderRadius: 8,
              }}
            />
            <Text style={{ color: theme['text-basic-color'] }}>Present</Text>
          </Layout>

          <Layout
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: 'transparent',
            }}
          >
            <Layout
              style={{
                width: 16,
                height: 16,
                backgroundColor: theme['color-danger-500'],
                borderRadius: 8,
              }}
            />
            <Text style={{ color: theme['text-basic-color'] }}>Absent</Text>
          </Layout>
        </Layout>
      </ScrollView>
    </SafeAreaView>
  );
}
