import { create } from 'zustand';
import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:4000/api';
  }
  return 'http://localhost:4000/api';
};

const BASE_URL = getBaseUrl();

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  authMethod: 'token', // 'token' (Bearer) or 'cookie' (Cookie Header)
  isLoading: false,
  error: null,

  setAuthMethod: (method) => set({ authMethod: method }),
  clearError: () => set({ error: null }),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      // Check if server set a cookie or returned a token in the body
      const responseToken = result.token;

      set({
        user: result.data,
        token: responseToken,
        isAuthenticated: true,
        isLoading: false,
      });
      return result;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Signup failed');
      }

      const responseToken = result.token;

      set({
        user: result.data,
        token: responseToken,
        isAuthenticated: true,
        isLoading: false,
      });
      return result;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    const { token, authMethod } = get();
    set({ isLoading: true });
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        if (authMethod === 'cookie') {
          headers['Cookie'] = `token=${token}`;
        } else {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers,
      });
    } catch (err) {
      console.warn('Server logout warning:', err.message);
    } finally {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },
}));
