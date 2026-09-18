import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { colors } from '../../../theme/colors';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useThemeStore } from '../../theme/store/useThemeStore';

export default function HomeScreen({ onLogout }) {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  const { user, token, authMethod, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  // Theme-aware colors
  const currentColors = {
    bg: isDark ? colors.bgDark : '#f3f4f6', // light grey bg or dark bg
    card: isDark ? colors.cardDark : '#ffffff',
    text: isDark ? colors.textDark : colors.textLight,
    textMuted: isDark ? colors.textMutedDark : colors.textMutedLight,
    border: isDark ? colors.borderDark : '#f3f4f6',
  };

  const truncatedToken = token ? `${token.substring(0, 15)}...${token.substring(token.length - 10)}` : 'None';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.bg }]}>
      <StatusBar
        backgroundColor={isDark ? colors.bgDark : '#ffffff'}
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: currentColors.text }]}>Rochetta Mobile</Text>
        <TouchableOpacity onPress={toggleTheme} style={[styles.themeBtn, { borderColor: currentColors.border }]} activeOpacity={0.8}>
          <Text style={styles.themeBtnText}>{isDark ? '☀️ Light' : '🌙 Dark'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Success Badge */}
        <View style={[styles.successBadge, { backgroundColor: isDark ? 'rgba(22, 163, 74, 0.15)' : colors.primaryLight }]}>
          <Text style={styles.badgeCheck}>✓</Text>
        </View>

        <Text style={[styles.title, { color: currentColors.text }]}>Success!</Text>
        <Text style={[styles.subtitle, { color: currentColors.textMuted }]}>
          You are authenticated with the online pharmacy ecommerce backend.
        </Text>

        {/* Session Details Card */}
        <View style={[styles.card, { backgroundColor: currentColors.card }]}>
          <Text style={[styles.cardTitle, { color: currentColors.text, borderBottomColor: currentColors.border }]}>
            Active Session & Auth Info
          </Text>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailKey, { color: currentColors.textMuted }]}>User Name:</Text>
            <Text style={[styles.detailVal, { color: currentColors.text }]}>{user?.name || 'Guest'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailKey, { color: currentColors.textMuted }]}>Email Address:</Text>
            <Text style={[styles.detailVal, { color: currentColors.text }]}>{user?.email || 'N/A'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailKey, { color: currentColors.textMuted }]}>Account Role:</Text>
            <Text style={[styles.detailVal, { color: colors.primary, fontWeight: 'bold' }]}>{user?.role || 'user'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailKey, { color: currentColors.textMuted }]}>API Auth Option:</Text>
            <Text style={[styles.detailVal, { color: colors.primary, fontWeight: 'bold' }]}>
              {authMethod === 'cookie' ? 'Cookie Header' : 'Bearer Token'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailKey, { color: currentColors.textMuted }]}>Active Token:</Text>
            <Text style={[styles.detailVal, { color: currentColors.text, fontSize: 11 }]} numberOfLines={1}>
              {truncatedToken}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailKey, { color: currentColors.textMuted }]}>Active Theme:</Text>
            <Text style={[styles.detailVal, { color: currentColors.text }]}>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.button} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  themeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  themeBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  badgeCheck: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 16,
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailKey: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailVal: {
    fontSize: 14,
    fontWeight: '600',
    maxWidth: '60%',
  },
  button: {
    backgroundColor: colors.error,
    borderRadius: 12,
    height: 52,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
