import { create } from 'zustand';
import { Appearance } from 'react-native';

export const useThemeStore = create((set) => ({
  theme: Appearance.getColorScheme() || 'light',
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light'
  })),
  setTheme: (theme) => set({ theme }),
}));
