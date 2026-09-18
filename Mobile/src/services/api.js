import { Platform } from 'react-native';
import { useAuthStore } from '../features/auth/store/useAuthStore';

// Detect whether we are on Android Emulator to map localhost to loopback IP
const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:4000/api';
  }
  return 'http://localhost:4000/api';
};

export const BASE_URL = getBaseUrl();

export const apiRequest = async (endpoint, options = {}) => {
  const { authMethod, token } = useAuthStore.getState();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Inject token based on the selected authMethod
  if (token) {
    if (authMethod === 'cookie') {
      headers['Cookie'] = `token=${token}`;
    } else {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
};
