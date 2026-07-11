import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';

import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { TasksProvider } from './src/context/TasksContext';
import { RootNavigator } from './src/navigation/RootNavigator';

// Traduce nuestra paleta (src/theme/colors.ts) al formato de tema que
// espera @react-navigation/native, para que fondo/texto de la navegación
// también respeten el modo oscuro.
const AppNavigation: React.FC = () => {
  const { colors, isDark } = useTheme();

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer theme={navigationTheme}>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <TasksProvider>
            <AppNavigation />
          </TasksProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
