import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppColors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TasksContext';
import { RootStackParamList } from '../navigation/types';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

// Pantalla de Ajustes: sólo pinta lo que le entregan los contextos.
// - Datos de cuenta -> useAuth() (el usuario que inició sesión de verdad)
// - % de productividad -> useTasks() (calculado sobre las tareas reales)
// - Modo oscuro -> useTheme() (persistido en AsyncStorage)
export const SettingsScreen: React.FC = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<Navigation>();
  const { user, logout } = useAuth();
  const { productivity } = useTasks();

  const displayName = user?.name?.trim() || 'Usuario';
  const username = user?.email ? `@${user.email.split('@')[0]}` : '@usuario';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Text style={styles.title}>Ajustes</Text>

      {/* Cuenta */}
      <View style={styles.card}>
        <Text style={styles.section}>👤 Cuenta</Text>

        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>

          <View>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.subtitle}>{username}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <Text style={styles.label}>Usuario</Text>
        <Text style={styles.value}>{username}</Text>

        <Text style={styles.label}>Correo</Text>
        <Text style={styles.value}>{user?.email ?? 'Sin sesión activa'}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ChangePassword')}
        >
          <Text style={styles.buttonText}>Cambiar contraseña</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Productividad */}
      <View style={styles.card}>
        <Text style={styles.section}>🎯 Productividad</Text>

        <Text style={styles.percent}>{productivity.percent}%</Text>
        <Text style={styles.productivitySubtitle}>
          {productivity.completed} de {productivity.total} tareas completadas
        </Text>

        <View style={styles.progress}>
          <View
            style={[styles.progressFill, { width: `${productivity.percent}%` }]}
          />
        </View>
      </View>

      {/* Apariencia */}
      <View style={styles.card}>
        <Text style={styles.section}>🎨 Apariencia</Text>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Modo oscuro</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.surface}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },

    title: {
      fontSize: 30,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 20,
    },

    card: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 18,
      marginBottom: 18,
    },

    section: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 15,
      color: colors.textPrimary,
    },

    profile: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },

    avatarText: {
      color: colors.surface,
      fontWeight: '700',
      fontSize: 22,
    },

    name: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.textPrimary,
    },

    subtitle: {
      color: colors.textSecondary,
    },

    separator: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 15,
    },

    label: {
      color: colors.textSecondary,
      marginTop: 10,
    },

    value: {
      fontWeight: '700',
      fontSize: 16,
      marginTop: 4,
      color: colors.textPrimary,
    },

    button: {
      marginTop: 20,
      backgroundColor: colors.primary,
      padding: 14,
      borderRadius: 10,
      alignItems: 'center',
    },

    buttonText: {
      color: colors.surface,
      fontWeight: '700',
    },

    logout: {
      textAlign: 'center',
      marginTop: 20,
      color: colors.danger,
      fontWeight: '700',
    },

    percent: {
      fontSize: 26,
      fontWeight: '700',
      color: colors.textPrimary,
    },

    productivitySubtitle: {
      color: colors.textSecondary,
      marginTop: 2,
      fontSize: 13,
    },

    progress: {
      height: 10,
      backgroundColor: colors.surfaceAlt,
      borderRadius: 20,
      marginTop: 15,
      overflow: 'hidden',
    },

    progressFill: {
      height: 10,
      backgroundColor: colors.primary,
      borderRadius: 20,
    },

    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    rowLabel: {
      color: colors.textPrimary,
    },
  });
