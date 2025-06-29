import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { SimpleSplashScreen } from './src/screens/SimpleSplashScreen';
import AudioPlayer from './src/components/AudioPlayer';
import { SimpleInput } from './src/components/SimpleInput';
import { Button } from './src/design-system/components/Button';
import { Logo } from './src/design-system/components/Logo';
import { colors, spacing, typography } from './src/design-system/theme';
import { Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, Alert } from 'react-native';

type Screen = 'splash' | 'login' | 'signup' | 'main';

function SimpleLoginScreen({ onLogin, onNavigate }: { onLogin: () => void; onNavigate: (screen: Screen) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn(email, password);
      onLogin();
    } catch (err: any) {
      Alert.alert('Login Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Logo />
        <Text style={styles.title}>Login</Text>
        <View style={styles.formFields}>
          <SimpleInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
          <SimpleInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            editable={!loading}
          />
        </View>
        <Button
          title="Login"
          onPress={handleLogin}
          variant="primary"
          size="large"
          loading={loading}
          style={{ width: '100%', marginTop: spacing.md }}
          disabled={!email || !password || loading}
        />
        <TouchableOpacity
          onPress={() => onNavigate('signup')}
          style={styles.link}
          disabled={loading}
        >
          <Text style={styles.linkText}>
            Don't have an account? <Text style={styles.linkTextBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function MainApp() {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <AudioPlayer />
    </SafeAreaView>
  );
}

function RootContent() {
  const { user, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (user) {
    return <MainApp />;
  }

  switch (currentScreen) {
    case 'splash':
      return (
        <SimpleSplashScreen
          onNavigateToLogin={() => setCurrentScreen('login')}
          onNavigateToSignUp={() => setCurrentScreen('signup')}
        />
      );
    case 'login':
      return (
        <SimpleLoginScreen
          onLogin={() => {}}
          onNavigate={setCurrentScreen}
        />
      );
    default:
      return (
        <SimpleSplashScreen
          onNavigateToLogin={() => setCurrentScreen('login')}
          onNavigateToSignUp={() => setCurrentScreen('signup')}
        />
      );
  }
}

function SimpleApp(): React.JSX.Element {
  return (
    <AuthProvider>
      <RootContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: colors.primary.nocturne,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.primary.white,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  formFields: {
    marginBottom: spacing.lg,
  },
  link: {
    marginTop: spacing.lg,
    padding: spacing.sm,
  },
  linkText: {
    color: colors.primary.white,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
  },
  linkTextBold: {
    fontWeight: 'bold',
  },
});

export default SimpleApp;