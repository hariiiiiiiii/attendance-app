import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

import LoginScreen from './screens/LoginScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

export default function App() {
  const [theme, setTheme] = useState('light');

  // Load theme from storage on start
  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem('theme');
      if (storedTheme) {
        setTheme(storedTheme);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva[theme]}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="LoginScreen">
            <Stack.Screen
              name="LoginScreen"
              options={{ headerShown: false }}
            >
              {props => (
                <LoginScreen {...props} toggleTheme={toggleTheme} theme={theme} />
              )}
            </Stack.Screen>

            <Stack.Screen
              name="AttendanceScreen"
              options={{ headerShown: false }}
            >
              {props => (
                <AttendanceScreen {...props} toggleTheme={toggleTheme} theme={theme} />
              )}
            </Stack.Screen>

            <Stack.Screen
              name="AnalyticsScreen"
              options={{ headerShown: false }}
            >
              {props => (
                <AnalyticsScreen {...props} toggleTheme={toggleTheme} theme={theme} />
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </>
  );
}
