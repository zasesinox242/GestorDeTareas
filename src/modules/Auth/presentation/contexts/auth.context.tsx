import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { UserEntity } from "../../domain/entities/user.entity";
import { authRepository } from "../../di/auth.dependencies";

type AuthContextType = {
  user: UserEntity | null;
  isLoading: boolean;
  setUser: (user: UserEntity | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO (Firebase): reemplazar por `onAuthStateChanged(auth, ...)`
    // para escuchar el estado de sesión en tiempo real.
    authRepository
      .getCurrentUser()
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("AuthContext esta fuera de AuthProvider");
  }

  return context;
};
