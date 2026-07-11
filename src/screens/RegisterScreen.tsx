import React, { useState } from 'react';
import {
  SafeAreaView,
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
  onBack: () => void;
}

export const RegisterScreen = ({ onBack }: Props) => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {

    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Campos requeridos', 'Completa todos los campos.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    const user: User = {
      name,
      email,
      password,
    };

    try {

      await AsyncStorage.setItem('user', JSON.stringify(user));

      Alert.alert(
        'Registro exitoso',
        'Ahora puedes iniciar sesión.',
        [
          {
            text: 'Aceptar',
            onPress: onBack,
          },
        ]
      );

    } catch {

      Alert.alert('Error', 'No se pudo guardar el usuario.');

    }

  };

  return (

    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>Crear cuenta</Text>

      <TextInput
        placeholder="Nombre"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Correo"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        placeholder="Confirmar contraseña"
        style={styles.input}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>
          Registrarse
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onBack}>
        <Text style={styles.back}>
          ← Volver al Login
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
    fontSize: 30,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 30,
    textAlign: 'center',
  },

  input: {
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  back: {
    textAlign: 'center',
    marginTop: 20,
    color: colors.primary,
    fontWeight: '700',
  },

});