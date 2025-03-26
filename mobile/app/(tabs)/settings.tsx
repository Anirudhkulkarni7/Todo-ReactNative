import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../../styles/theme';

// A static toggle component with a subtle animated thumb
const StaticToggle = ({ value }: { value: boolean }) => {
  const toggleAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(toggleAnim, {
      toValue: value ? 1 : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [value, toggleAnim]);

  const translateX = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  return (
    <View
      style={[
        toggleStyles.container,
        { backgroundColor: value ? theme.colors.button : theme.colors.border },
      ]}
    >
      <Animated.View style={[toggleStyles.thumb, { transform: [{ translateX }] }]} />
    </View>
  );
};

const toggleStyles = StyleSheet.create({
  container: {
    width: 40,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    padding: 2,
  },
  thumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.white,
  },
});

export default function SettingsScreen() {
  // Header animation: fade in and slide down
  const headerFadeAnim = useRef(new Animated.Value(0)).current;
  const headerSlideAnim = useRef(new Animated.Value(-30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(headerSlideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [headerFadeAnim, headerSlideAnim]);

  return (
    <ScrollView style={styles.scrollView}>
      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          { opacity: headerFadeAnim, transform: [{ translateY: headerSlideAnim }] },
        ]}
      >
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your experience</Text>
      </Animated.View>

      {/* Notifications Section with static toggles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.row}>
          <Text style={styles.rowTitle}>Push Notifications</Text>
          <StaticToggle value={true} />
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <Text style={styles.rowTitle}>Email Alerts</Text>
          <StaticToggle value={false} />
        </View>
      </View>

      {/* Preferences Section with creative toggles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.row}>
          <Text style={styles.rowTitle}>Dark Mode</Text>
          <StaticToggle value={true} />
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <Text style={styles.rowTitle}>Auto-Sync</Text>
          <StaticToggle value={true} />
        </View>
      </View>

      {/* Privacy & Security Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy & Security</Text>
        <View style={styles.row}>
          <Text style={styles.rowTitle}>Location Services</Text>
          <StaticToggle value={false} />
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <Text style={styles.rowTitle}>Data Sharing</Text>
          <StaticToggle value={false} />
        </View>
      </View>

      {/* Account Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.row}>
          <Text style={styles.rowTitle}>Profile</Text>
          <Text style={styles.rowValue}>John Doe</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <Text style={styles.rowTitle}>Email</Text>
          <Text style={styles.rowValue}>john@example.com</Text>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.row}>
          <Text style={styles.rowTitle}>App Version</Text>
          <Text style={styles.rowValue}>1.0.0</Text>
        </View>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowTitle}>Feedback</Text>
          <Text style={styles.rowArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Todo App. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  headerTitle: {
    fontSize: theme.fontSizes.title,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  headerSubtitle: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  section: {
    marginVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.medium,
    color: "#555555", // Darker for better contrast on white background
    marginBottom: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  rowTitle: {
    fontSize: theme.fontSizes.medium,
    color: "#333333", // Darker text for readability on white
  },
  rowValue: {
    fontSize: theme.fontSizes.medium,
    color: "#666666", // Adjusted for contrast on white
  },
  rowArrow: {
    fontSize: theme.fontSizes.medium,
    color: "#666666",
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  footer: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  footerText: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.textSecondary,
  },
});
