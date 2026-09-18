import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { colors } from '../../../theme/colors';
import { useThemeStore } from '../../theme/store/useThemeStore';

export default function SplashScreen({ onFinish }) {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  // Animation values
  const pulseAnim = useRef(new Animated.Value(0.95)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulsing animation for the main logo container
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fade in for the text and indicator
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    // Auto-finish after 3.5 seconds
    const timer = setTimeout(() => {
      onFinish();
    }, 3500);

    return () => clearTimeout(timer);
  }, [pulseAnim, fadeAnim, onFinish]);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? colors.bgDark : colors.forestGreen }]}>
      <StatusBar
        backgroundColor={isDark ? colors.bgDark : colors.forestGreen}
        barStyle="light-content"
      />

      {/* Deep dark green overlay */}
      {!isDark && <View style={styles.overlay} />}

      <SafeAreaView style={styles.safeArea}>
        {/* Theme Toggle at Top Right */}
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeToggleBtn} activeOpacity={0.7}>
            <Text style={styles.themeToggleText}>
              {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          {/* Animated Pill-shaped Logo Icon */}
          <Animated.View style={[styles.logoContainer, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.pillIcon}>
              <View style={styles.pillHalfLeft} />
              <View style={styles.pillHalfRight} />
              <View style={styles.crossHorizontal} />
              <View style={styles.crossVertical} />
            </View>
          </Animated.View>

          {/* Brand Name */}
          <Animated.View style={[styles.brandContainer, { opacity: fadeAnim }]}>
            <Text style={styles.title}>Rochetta</Text>
            <Text style={styles.subtitle}>Premium Online Pharmacy & E-commerce</Text>
            <Text style={styles.tagline}>Your health, delivered directly to your doorstep</Text>
          </Animated.View>

          {/* Beautiful Custom Loading Indicator */}
          <Animated.View style={[styles.loaderContainer, { opacity: fadeAnim }]}>
            <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
            <Text style={styles.loadingText}>Initializing pharmacy experience...</Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)', // slight dark overlay over the forest green
  },
  safeArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  themeToggleBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  themeToggleText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  logoContainer: {
    width: 130,
    height: 130,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(22, 163, 74, 0.5)', // semi-transparent primary green
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 8,
    marginBottom: 40,
  },
  pillIcon: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Custom pill shape using borders and shapes
  pillHalfLeft: {
    position: 'absolute',
    width: 25,
    height: 50,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    left: 8,
    transform: [{ rotate: '-45deg' }],
  },
  pillHalfRight: {
    position: 'absolute',
    width: 25,
    height: 50,
    backgroundColor: colors.primary,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    right: 8,
    transform: [{ rotate: '-45deg' }],
  },
  // Plus sign in the middle of logo
  crossHorizontal: {
    position: 'absolute',
    width: 20,
    height: 6,
    backgroundColor: '#ffffff',
    borderRadius: 3,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  crossVertical: {
    position: 'absolute',
    width: 6,
    height: 20,
    backgroundColor: '#ffffff',
    borderRadius: 3,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  brandContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  title: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: colors.primaryLight,
    marginTop: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: 6,
    fontWeight: '500',
    textAlign: 'center',
  },
  loaderContainer: {
    alignItems: 'center',
  },
  spinner: {
    marginBottom: 12,
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
