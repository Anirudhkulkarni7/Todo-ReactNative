import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      <Text style={styles.description}>
        View and update your personal information here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: theme.spacing.md, 
    backgroundColor: theme.colors.white 
  },
  title: { 
    fontSize: theme.fontSizes.large, 
    fontWeight: 'bold', 
    marginBottom: theme.spacing.sm, 
    color: theme.colors.text 
  },
  description: { 
    fontSize: theme.fontSizes.medium, 
    color: theme.colors.textSecondary, 
    textAlign: 'center' 
  }
});
