import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppColors, darkColors, lightColors } from './colors';

export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = '@gestor_tareas:theme_mode';

interface ThemeContextValue {
  mode: ThemeMode;
  colors: AppColors;
  isDark: boolean;
  isLoading: boolean;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Toda la lógica de "cómo se guarda/recupera el tema" vive aquí,
// separada de los componentes visuales que solo consumen `useTheme()`.
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadStoredTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (isMounted && (stored === 'light' || stored === 'dark')) {
          setMode(stored);
        }
      } catch {
        // Si falla la lectura, simplemente se mantiene el tema claro por defecto.
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadStoredTheme();

    return () => {
      isMounted = false;
    };
  }, []);

  const persistTheme = useCallback(async (newMode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch {
      // Si no se puede persistir, la app sigue funcionando con el valor en memoria.
    }
  }, []);

  const setTheme = useCallback(
    (newMode: ThemeMode) => {
      setMode(newMode);
      persistTheme(newMode);
    },
    [persistTheme]
  );

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      const next: ThemeMode = prev === 'light' ? 'dark' : 'light';
      persistTheme(next);
      return next;
    });
  }, [persistTheme]);

  const value = useMemo<ThemeContextValue>(() => {
    const isDark = mode === 'dark';
    return {
      mode,
      isDark,
      isLoading,
      colors: isDark ? darkColors : lightColors,
      toggleTheme,
      setTheme,
    };
  }, [mode, isLoading, toggleTheme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Hook público para que cualquier pantalla o componente consuma el tema activo.
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider');
  }
  return context;
};
