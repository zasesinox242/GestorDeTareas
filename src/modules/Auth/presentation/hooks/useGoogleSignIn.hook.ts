import { useRef, useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { loginWithGoogleUseCase } from "../../di/auth.dependencies";
import { useAuthContext } from "../contexts/auth.context";

export const useGoogleSignIn = () => {
  const router = useRouter();
  const { setUser } = useAuthContext();
  const inProgress = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (inProgress.current) return;

    inProgress.current = true;
    setIsLoading(true);

    try {
      const result = await loginWithGoogleUseCase.execute();
      if (result.status === "cancelled") return;

      setUser(result.user);
      router.replace("/tasks");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudo iniciar sesión con Google",
      );
    } finally {
      inProgress.current = false;
      setIsLoading(false);
    }
  };

  return { isLoading, handleGoogleSignIn };
};
