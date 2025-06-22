import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../design-system/components/Button';

export const SignUpScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up Screen</Text>
      <Button
        title="Go to Login (placeholder)"
        onPress={() => navigation.navigate('Login')}
        variant="primary"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2E2464', // Matching the splash screen theme
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
}); 