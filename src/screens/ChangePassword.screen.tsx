import React, { useMemo, useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { AppColors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { useAuth, AuthError } from '../context/AuthContext';

// Antes esta pantalla no validaba ni guardaba nada ("aquí posteriormente
// se podrá validar y guardar"); ahora usa useAuth().changePassword, que sí
// valida la contraseña actual y persiste la nueva.
export const ChangePasswordScreen: React.FC = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation();
  const { changePassword } = useAuth();

  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');

  const guardarCambios = async () => {
    if (!actual || !nueva || !confirmar) {
      Alert.alert('Campos requeridos', 'Completa todos los campos.');
      return;
    }

    if (nueva !== confirmar) {
      Alert.alert('Error', 'Las contraseñas nuevas no coinciden.');
      return;
    }

    try {
      await changePassword(actual, nueva);
      Alert.alert('Contraseña actualizada', 'Tu contraseña se cambió correctamente.', [
        { text: 'Aceptar', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      const message =
        error instanceof AuthError
          ? error.message
          : 'No se pudo actualizar la contraseña.';
      Alert.alert('Error', message);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Text style={styles.title}>Cambiar contraseña</Text>

      <TextInput
        style={styles.input}
        placeholder="Contraseña actual"
        placeholderTextColor={colors.textSecondary}
        secureTextEntry
        value={actual}
        onChangeText={setActual}
      />

      <TextInput
        style={styles.input}
        placeholder="Nueva contraseña"
        placeholderTextColor={colors.textSecondary}
        secureTextEntry
        value={nueva}
        onChangeText={setNueva}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        placeholderTextColor={colors.textSecondary}
        secureTextEntry
        value={confirmar}
        onChangeText={setConfirmar}
      />

      <TouchableOpacity style={styles.button} onPress={guardarCambios}>
        <Text style={styles.buttonText}>Guardar cambios</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Volver</Text>
      </TouchableOpacity>
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
      fontSize: 28,
      fontWeight: '700',
      marginBottom: 25,
      color: colors.textPrimary,
    },
    input: {
      backgroundColor: colors.surface,
      padding: 15,
      borderRadius: 10,
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
      marginTop: 10,
    },
    buttonText: {
      color: colors.surface,
      fontWeight: '700',
    },
    back: {
      marginTop: 25,
      textAlign: 'center',
      color: colors.primary,
      fontWeight: '700',
    },
  });
