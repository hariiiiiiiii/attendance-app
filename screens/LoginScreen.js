import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Layout, Text, Input, Button, Icon, Toggle, useTheme } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = ({ navigation, toggleTheme, theme: currentTheme }) => {
  const [usn, setUsn] = useState('');
  const [error, setError] = useState('');
  const theme = useTheme();

  const handleLogin = () => {
    if (usn.trim() === '') {
      setError('USN cannot be empty');
    } else {
      setError('');
      navigation.navigate('AttendanceScreen', { usn });
    }
  };

  const PersonIcon = (props) => (
    <Icon {...props} name="person-outline" fill={theme['text-basic-color']} />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={[styles.container, { backgroundColor: theme['background-basic-color-1'] }]}>
        <View style={styles.toggleWrapper}>
          <Toggle checked={currentTheme === 'dark'} onChange={toggleTheme} status="primary">
            {currentTheme === 'dark' ? 'Dark' : 'Light'}
          </Toggle>
        </View>

        <Text category="h3" status="control" style={[styles.title, { color: theme['text-control-color'] }]}>
          Enter USN
        </Text>

        <Input
          placeholder="USN"
          value={usn}
          onChangeText={setUsn}
          status={error ? 'danger' : 'basic'}
          caption={error}
          style={[styles.input, { backgroundColor: theme['background-basic-color-2'] }]}
          textStyle={{ color: theme['text-basic-color'] }}
          accessoryRight={PersonIcon}
        />

        <Button style={styles.button} onPress={handleLogin} status="primary">
          Login
        </Button>
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  toggleWrapper: {
    position: 'absolute',
    top: 20,
    right: 24,
    zIndex: 10,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '700',
  },
  input: {
    marginBottom: 12,
    borderRadius: 12,
  },
  button: {
    borderRadius: 50,
    marginTop: 12,
  },
});

export default LoginScreen;
