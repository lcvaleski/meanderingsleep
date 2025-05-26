/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function AuthScreen(): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const { signIn, signUp, loading } = useAuth();
  const isDarkMode = useColorScheme() === 'dark';

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (error) {
      console.error(error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <View style={styles.authContainer}>
      <Text style={[styles.title, { color: isDarkMode ? Colors.white : Colors.black }]}>
        {isLogin ? 'Login' : 'Sign Up'}
      </Text>
      <TextInput
        style={[styles.input, { color: isDarkMode ? Colors.white : Colors.black }]}
        placeholder="Email"
        placeholderTextColor={isDarkMode ? Colors.light : Colors.dark}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, { color: isDarkMode ? Colors.white : Colors.black }]}
        placeholder="Password"
        placeholderTextColor={isDarkMode ? Colors.light : Colors.dark}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleAuth}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={styles.buttonText}>
            {isLogin ? 'Login' : 'Sign Up'}
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setIsLogin(!isLogin)}
        style={styles.switchButton}>
        <Text style={[styles.switchText, { color: isDarkMode ? Colors.light : Colors.dark }]}>
          {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function MainApp(): React.JSX.Element {
  const { user, logout } = useAuth();
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <View style={[backgroundStyle, styles.container]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView style={backgroundStyle}>
        <View style={styles.header}>
          <Header />
        </View>
        <View style={styles.content}>
          <Section title="Welcome">
            You are logged in as {user.email}
          </Section>
          <TouchableOpacity style={styles.button} onPress={logout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  content: {
    padding: 20,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  switchText: {
    fontSize: 16,
  },
});

export default App;
