import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { signup } from '../services/authService';
import { theme } from '../styles/theme';

export default function SignupScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');

  const handleSignup = async () => {
    try {
      await signup(username, email, password, avatar);
      Alert.alert('Success', 'Account created successfully');
      router.push({ pathname: '/login' });
    } catch (error: any) {
      console.log(error);
      Alert.alert('Error', error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={avatar ? { uri: avatar } : { uri: 'https://randomuser.me/api/portraits/women/75.jpg' }}
          style={styles.avatar}
        />
        <LottieView
          source={require('../assets/animations/register.json')}
          autoPlay
          loop
          renderMode="SOFTWARE"
          style={styles.avatarAnimation}
        />
      </View>
      <Text style={styles.title}>Create an Account</Text>
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor={theme.colors.textSecondary}
        />
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
        {/* <TextInput
          placeholder="Avatar URL (optional)"
          style={styles.input}
          value={avatar}
          onChangeText={setAvatar}
          placeholderTextColor={theme.colors.textSecondary}
        /> */}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push({ pathname: '/login' })}>
        <Text style={styles.link}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarAnimation: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 50,  // Increased from 40 to 50
    height: 50, // Increased from 40 to 50
  },
  title: { 
    fontSize: theme.fontSizes.xlarge,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  input: { 
    width: '100%',
    backgroundColor: theme.colors.white,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius,
    fontSize: theme.fontSizes.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: '#333333', 
  },
  button: {
    backgroundColor: theme.colors.button,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius,
    width: '100%',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.medium,
    fontWeight: 'bold',
  },
  link: {
    color: theme.colors.button,
    fontSize: theme.fontSizes.medium,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
});
