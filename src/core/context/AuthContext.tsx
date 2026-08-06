import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { User } from '../models/User';
import {
  AuthError,
  changeAccountPassword,
  registerAccount,
  validateCredentials,
} from '../services/authService';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (user: User) => Promise<void>;
  logout: () => void;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Guarda el usuario que inició sesión y expone las acciones de cuenta.
// Las pantallas de Login/Registro/Ajustes consumen esto en vez de hablar
// directamente con AsyncStorage o manejar sus propios estados sueltos.
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    // Puede lanzar AuthError; la pantalla decide cómo mostrarlo (Alert, etc).
    const account = await validateCredentials(email, password);
    setUser(account);
    return account;
  }, []);

  const register = useCallback(async (newUser: User) => {
    await registerAccount(newUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      if (!user) {
        throw new AuthError('No hay una sesión activa.');
      }
      const updated = await changeAccountPassword(currentPassword, newPassword);
      setUser(updated);
    },
    [user]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      register,
      logout,
      changePassword,
    }),
    [user, login, register, logout, changePassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export { AuthError };
