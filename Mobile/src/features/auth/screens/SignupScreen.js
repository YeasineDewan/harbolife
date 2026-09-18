import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
  ImageBackground,
  Image,
} from 'react-native';
import { colors } from '../../../theme/colors';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../../theme/store/useThemeStore';
import { UserIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon, ArrowLeftIcon } from '../../../components/Icons';

const loginBg = require('../../../assets/login_background.webp');

export default function SignupScreen({ onNavigateToLogin, onSignupSuccess }) {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  const { signup, error, clearError, isLoading } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Field errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Field focus states
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

  const validate = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else if (name.trim().length < 3) {
      setNameError('Name must be at least 3 characters');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setEmailError('Invalid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    return isValid;
  };

  const handleSignup = async () => {
    if (validate()) {
      try {
        await signup(name, email, password);
        onSignupSuccess();
      } catch (err) {
        // Error is set in store and displayed
      }
    }
  };

  const currentColors = {
    bg: isDark ? colors.bgDark : colors.bgLight,
    card: isDark ? colors.cardDark : colors.cardLight,
    text: isDark ? colors.textDark : colors.textLight,
    textMuted: isDark ? colors.textMutedDark : colors.textMutedLight,
    border: isDark ? colors.borderDark : colors.borderLight,
    inputBg: isDark ? colors.inputDark : '#f9fafb',
    errorBg: isDark ? colors.errorBgDark : colors.errorBgLight,
    iconColor: isDark ? colors.textMutedDark : colors.textMutedLight,
    activeIconColor: colors.primary,
  };

  return (
    <ImageBackground
      source={loginBg}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <StatusBar
          backgroundColor={isDark ? colors.bgDark : colors.forestGreen}
          barStyle="light-content"
        />
        
        {/* Backdrop glass overlay - matches Web's gradient depth above the pills background */}
        <View style={StyleSheet.absoluteFill}>
          {[...Array(10).keys()].map((i) => (
            <View
              key={i}
              style={{
                height: '10%',
                width: '100%',
                backgroundColor: isDark ? '#121212' : '#012b01',
                opacity: isDark ? (0.6 + i * 0.03) : (0.45 + i * 0.035),
              }}
            />
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Top actions: Back + Theme Toggle */}
          <View style={styles.topActions}>
            <TouchableOpacity style={[styles.backButton, { borderColor: currentColors.border }]} onPress={onNavigateToLogin}>
              <View style={styles.backButtonContent}>
                <ArrowLeftIcon color="#ffffff" />
                <Text style={styles.backButtonText}>Back</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={toggleTheme} style={styles.themeBadge} activeOpacity={0.8}>
              <Text style={styles.themeBadgeText}>
                {isDark ? '☀️ Light' : '🌙 Dark'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Main Card */}
          <View style={[styles.card, { backgroundColor: currentColors.card }]}>
            


            {/* Header */}
            <Text style={styles.title}>Create Account</Text>
            <Text style={[styles.subtitle, { color: currentColors.textMuted }]}>
              Sign up to start tracking your health records
            </Text>

            {/* Form */}
            <View style={styles.form}>
              
              {/* Name Field */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: currentColors.text }]}>Full Name</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    { backgroundColor: currentColors.inputBg, borderColor: currentColors.border },
                    isNameFocused && styles.inputWrapperFocused,
                    nameError ? styles.inputWrapperError : null,
                  ]}
                >
                  <View style={styles.inputIconWrapper}>
                    <UserIcon color={isNameFocused ? currentColors.activeIconColor : currentColors.iconColor} />
                  </View>
                  <TextInput
                    style={[styles.input, { color: currentColors.text }]}
                    placeholder="Enter your full name"
                    placeholderTextColor={isDark ? colors.textMutedDark : colors.textMutedLight}
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      if (nameError) validate();
                    }}
                    onFocus={() => setIsNameFocused(true)}
                    onBlur={() => setIsNameFocused(false)}
                  />
                </View>
                {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
              </View>

              {/* Email Field */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: currentColors.text }]}>Email Address</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    { backgroundColor: currentColors.inputBg, borderColor: currentColors.border },
                    isEmailFocused && styles.inputWrapperFocused,
                    emailError ? styles.inputWrapperError : null,
                  ]}
                >
                  <View style={styles.inputIconWrapper}>
                    <MailIcon color={isEmailFocused ? currentColors.activeIconColor : currentColors.iconColor} />
                  </View>
                  <TextInput
                    style={[styles.input, { color: currentColors.text }]}
                    placeholder="Enter your email"
                    placeholderTextColor={isDark ? colors.textMutedDark : colors.textMutedLight}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (emailError) validate();
                    }}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                  />
                </View>
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
              </View>

              {/* Password Field */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: currentColors.text }]}>Password</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    { backgroundColor: currentColors.inputBg, borderColor: currentColors.border },
                    isPasswordFocused && styles.inputWrapperFocused,
                    passwordError ? styles.inputWrapperError : null,
                  ]}
                >
                  <View style={styles.inputIconWrapper}>
                    <LockIcon color={isPasswordFocused ? currentColors.activeIconColor : currentColors.iconColor} />
                  </View>
                  <TextInput
                    style={[styles.input, { color: currentColors.text }]}
                    placeholder="Create a password"
                    placeholderTextColor={isDark ? colors.textMutedDark : colors.textMutedLight}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (passwordError) validate();
                    }}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon color={currentColors.iconColor} />
                    ) : (
                      <EyeIcon color={currentColors.iconColor} />
                    )}
                  </TouchableOpacity>
                </View>
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
              </View>

              {/* Confirm Password Field */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: currentColors.text }]}>Confirm Password</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    { backgroundColor: currentColors.inputBg, borderColor: currentColors.border },
                    isConfirmPasswordFocused && styles.inputWrapperFocused,
                    confirmPasswordError ? styles.inputWrapperError : null,
                  ]}
                >
                  <View style={styles.inputIconWrapper}>
                    <LockIcon color={isConfirmPasswordFocused ? currentColors.activeIconColor : currentColors.iconColor} />
                  </View>
                  <TextInput
                    style={[styles.input, { color: currentColors.text }]}
                    placeholder="Confirm your password"
                    placeholderTextColor={isDark ? colors.textMutedDark : colors.textMutedLight}
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      if (confirmPasswordError) validate();
                    }}
                    onFocus={() => setIsConfirmPasswordFocused(true)}
                    onBlur={() => setIsConfirmPasswordFocused(false)}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon color={currentColors.iconColor} />
                    ) : (
                      <EyeIcon color={currentColors.iconColor} />
                    )}
                  </TouchableOpacity>
                </View>
                {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
              </View>

              {/* Global API Error Card */}
              {error && (
                <View style={[styles.globalErrorCard, { backgroundColor: currentColors.errorBg }]}>
                  <Text style={styles.globalErrorText}>{error}</Text>
                </View>
              )}

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleSignup}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText}>Create Account  →</Text>
                )}
              </TouchableOpacity>

            </View>

            {/* Footer Navigation Link */}
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: currentColors.textMuted }]}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={onNavigateToLogin}>
                <Text style={styles.linkText}>Login</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 20,
    borderWidth: 1,
  },
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  themeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  themeBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  card: {
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 26,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
    lineHeight: 20,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
  },
  inputWrapperError: {
    borderColor: colors.error,
  },
  inputIconWrapper: {
    marginRight: 10,
    width: 24,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 8,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  globalErrorCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.error,
    marginBottom: 14,
    alignItems: 'center',
  },
  globalErrorText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: colors.primaryLight,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
