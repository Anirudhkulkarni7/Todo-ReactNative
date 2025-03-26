import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

type IoniconsName = keyof typeof Ionicons.glyphMap;

export default function TabsLayout() {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false, // Remove the header from all tabs
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: IoniconsName;
          if (route.name === 'home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'charts') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          }
          else {
            iconName = 'home'; // fallback
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.secondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: 'rgba(0,0,0,0.1)',
          height: 65,
          paddingBottom: theme.spacing.sm,
          elevation: 4,
          shadowColor: theme.colors.primary,
          shadowOpacity: 0.1,
          shadowRadius: 5,
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="charts" options={{ title: 'Analytics' }} />

      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
