import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { User } from '../models/User';

interface Props {
  onLogin: () => void;
  onRegister: () => void;
}

export const LoginScreen = ({ onLogin, onRegister }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const data = await AsyncStorage.getItem('user');

      if (!data) {
        Alert.alert('Error', 'No existe ningún usuario registrado.');
        return;
      }

      const user: User = JSON.parse(data);

      if (user.email === email && user.password === password) {
        Alert.alert('Bienvenido', user.name);
        onLogin();
      } else {
        Alert.alert('Error', 'Correo o contraseña incorrectos.');
      }
    } catch (error) {
      Alert.alert('Error', 'No fue posible iniciar sesión.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>Gestor de Tareas</Text>

      <Text style={styles.subtitle}>
        Inicia sesión para continuar
      </Text>

      <TextInput
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>
          Iniciar sesión
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onRegister}>
        <Text style={styles.register}>
          ¿No tienes cuenta? Regístrate
        </Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

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
  },

  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
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