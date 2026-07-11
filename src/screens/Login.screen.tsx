import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppColors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { useAuth, AuthError } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/types';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'Login'>;

// Pantalla de login: sólo UI. La validación de credenciales vive en
// AuthContext -> authService, no aquí.
export const LoginScreen: React.FC = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<Navigation>();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const user = await login(email, password);
      Alert.alert('Bienvenido', user.name);
      // No hace falta navegar manualmente: al autenticarse, RootNavigator
      // cambia automáticamente al grupo de pantallas de la app logueada.
    } catch (error) {
      const message =
        error instanceof AuthError
          ? error.message
          : 'No fue posible iniciar sesión.';
      Alert.alert('Error', message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Gestor de Tareas</Text>

      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

      <TextInput
        placeholder="Correo"
        placeholderTextColor={colors.textSecondary}
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Contraseña"
        placeholderTextColor={colors.textSecondary}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.register}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 25,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.textPrimary,
      textAlign: 'center',
    },
    subtitle: {
      textAlign: 'center',
      marginBottom: 35,
      color: colors.textSecondary,
    },
    input: {
      backgroundColor: colors.surface,
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      color: colors.textPrimary,
      borderWidth: 1,
      borderColor: colors.border,
    },
    button: {
      backgroundColor: colors.primary,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    buttonText: {
      color: colors.surface,
      fontWeight: '700',
      fontSize: 16,
    },
    register: {
      textAlign: 'center',
      marginTop: 20,
      color: colors.primary,
      fontWeight: '700',
    },
  });
