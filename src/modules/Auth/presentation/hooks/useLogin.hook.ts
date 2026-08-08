import { useState } from "react";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { loginUseCase } from "../../di/auth.dependencies";
import { useAuthContext } from "../contexts/auth.context";

const DATA_STATES_DEFAULT = {
  isLoading: false,
  isError: false,
};

export const useLogin = () => {
  const router = useRouter();
  const { setUser } = useAuthContext();

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [dataStates, setDataStates] = useState(DATA_STATES_DEFAULT);

  const handleChange = (field: "email" | "password", value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    setDataStates({ ...DATA_STATES_DEFAULT, isLoading: true });
    try {
      const result = await loginUseCase.execute(credentials.email, credentials.password);
      setUser(result);
      router.replace("/tasks");
    } catch (error: any) {
      Alert.alert("Error", error?.message ?? "Error al iniciar sesión");
      setDataStates({ ...DATA_STATES_DEFAULT, isError: true });
    } finally {
      setDataStates((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return { credentials, dataStates, handleChange, handleLogin };
};
