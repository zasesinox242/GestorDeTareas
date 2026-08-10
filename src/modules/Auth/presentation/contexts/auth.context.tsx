import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase";
import { clearLegacyAuthStorage } from "@/config/firebase/legacy-auth";
import { UserEntity } from "../../domain/entities/user.entity";

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
    let isMounted = true;
    let unsubscribe: VoidFunction | undefined;

    void clearLegacyAuthStorage()
      .catch(() => undefined)
      .then(() => {
        if (!isMounted) return;

        unsubscribe = onAuthStateChanged(
          auth,
          (firebaseUser) => {
            setUser(
              firebaseUser
                ? {
                    id: firebaseUser.uid,
                    email: firebaseUser.email ?? "",
                    nombre: firebaseUser.displayName ?? undefined,
                  }
                : null,
            );
            setIsLoading(false);
          },
          () => {
            setUser(null);
            setIsLoading(false);
          },
        );
      });

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
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
