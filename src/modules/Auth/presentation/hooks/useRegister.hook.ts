import { useState } from "react";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { registerUseCase } from "../../di/auth.dependencies";
import { useAuthContext } from "../contexts/auth.context";

const DATA_STATES_DEFAULT = {
  isLoading: false,
  isError: false,
};

export const useRegister = () => {
  const router = useRouter();
  const { setUser } = useAuthContext();

  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [dataStates, setDataStates] = useState(DATA_STATES_DEFAULT);

  const handleChange = (field: "nombre" | "email" | "password", value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (!form.nombre.trim()) {
      Alert.alert("Datos incompletos", "Ingresa tu nombre");
      return;
    }

    setDataStates({ ...DATA_STATES_DEFAULT, isLoading: true });
    try {
      const result = await registerUseCase.execute(
        form.email,
        form.password,
        form.nombre.trim(),
      );
      setUser(result);
      router.replace("/tasks");
    } catch (error: any) {
      Alert.alert("Error", error?.message ?? "Error al registrarse");
      setDataStates({ ...DATA_STATES_DEFAULT, isError: true });
    } finally {
      setDataStates((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return { form, dataStates, handleChange, handleRegister };
};
