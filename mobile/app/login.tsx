import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { login } from '../services/authService';
import { theme } from '../styles/theme';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
      Alert.alert('Success', 'Logged in successfully');
      router.push({ pathname: '/(tabs)/home' });
    } catch (error: any) {
      console.log(error);
      Alert.alert('Error', error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/animations/loading.json')}
        autoPlay
        loop
        renderMode="SOFTWARE"
        style={styles.animation}
      />
      <Text style={styles.title}>Welcome Back!</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={theme.colors.textSecondary}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push({ pathname: '/signup' })}>
        <Text style={styles.link}>Don't have an account? Create one</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center'
  },
  animation: {
    width: 250,
    height: 250,
    marginBottom: theme.spacing.lg,
    backgroundColor: 'transparent'
  },
  title: {  
    fontSize: theme.fontSizes.xlarge, 
    fontWeight: 'bold', 
    marginBottom: theme.spacing.lg, 
    color: theme.colors.text 
  },
  inputContainer: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  input: { 
    width: '100%', 
    backgroundColor: theme.colors.white, 
    padding: theme.spacing.md, 
    marginBottom: theme.spacing.sm, 
    borderRadius: theme.borderRadius, 
    fontSize: theme.fontSizes.medium, 
    borderColor: theme.colors.border, 
    borderWidth: 1, 
    color: '#333333', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  button: { 
    backgroundColor: theme.colors.button, 
    padding: theme.spacing.md, 
    borderRadius: theme.borderRadius, 
    width: '100%', 
    alignItems: 'center', 
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: { 
    color: theme.colors.white, 
    fontSize: theme.fontSizes.medium, 
    fontWeight: 'bold' 
  },
  link: { 
    color: theme.colors.button, 
    fontSize: theme.fontSizes.medium, 
    marginTop: theme.spacing.sm 
  }
});
