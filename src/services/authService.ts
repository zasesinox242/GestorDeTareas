import AsyncStorage from '@react-native-async-storage/async-storage';

import { User } from '../models/User';
import { STORAGE_KEYS } from './storageKeys';

// Este archivo concentra TODA la lógica de negocio relacionada a la cuenta
// del usuario (registro, inicio de sesión, cambio de contraseña).
// Las pantallas (screens) sólo deben llamar a estas funciones, nunca
// hablar directamente con AsyncStorage.

export class AuthError extends Error {}

export const getStoredAccount = async (): Promise<User | null> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.ACCOUNT);
  return raw ? (JSON.parse(raw) as User) : null;
};

export const registerAccount = async (user: User): Promise<User> => {
  await AsyncStorage.setItem(STORAGE_KEYS.ACCOUNT, JSON.stringify(user));
  return user;
};

// Valida las credenciales contra la única cuenta registrada en el dispositivo.
// Lanza AuthError con un mensaje listo para mostrarse en un Alert.
export const validateCredentials = async (
  email: string,
  password: string
): Promise<User> => {
  const account = await getStoredAccount();

  if (!account) {
    throw new AuthError('No existe ningún usuario registrado.');
  }

  if (account.email !== email || account.password !== password) {
    throw new AuthError('Correo o contraseña incorrectos.');
  }

  return account;
};

// Cambia la contraseña de la cuenta actualmente registrada, validando
// primero la contraseña actual, y devuelve el usuario ya actualizado.
export const changeAccountPassword = async (
  currentPassword: string,
  newPassword: string
): Promise<User> => {
  const account = await getStoredAccount();

  if (!account) {
    throw new AuthError('No existe ningún usuario registrado.');
  }

  if (account.password !== currentPassword) {
    throw new AuthError('La contraseña actual no es correcta.');
  }

  const updatedAccount: User = { ...account, password: newPassword };
  await AsyncStorage.setItem(
    STORAGE_KEYS.ACCOUNT,
    JSON.stringify(updatedAccount)
  );

  return updatedAccount;
};
