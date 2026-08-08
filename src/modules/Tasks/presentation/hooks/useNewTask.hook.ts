import { useState } from "react";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { TaskEntity } from "../../domain/entities/task.entity";
import { createTaskUseCase } from "../../di/task.dependencies";
import { useAuthContext } from "@/modules/Auth/presentation/contexts/auth.context";

const EMPTY_TASK: TaskEntity = {
  titulo: "",
  descripcion: "",
  completada: false,
  prioridad: "media",
};

export const useNewTask = () => {
  const router = useRouter();
  const { user } = useAuthContext();

  const [task, setTask] = useState<TaskEntity>(EMPTY_TASK);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = <K extends keyof TaskEntity>(field: K, value: TaskEntity[K]) => {
    setTask((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!task.titulo) {
      Alert.alert("Error", "Ingresa un título para la tarea");
      return;
    }

    if (!user?.id) {
      Alert.alert("Error", "No se detectó una sesión activa");
      return;
    }

    setIsSaving(true);
    try {
      await createTaskUseCase.execute(task, user.id);
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error?.message ?? "No se pudo crear la tarea");
    } finally {
      setIsSaving(false);
    }
  };

  return { task, isSaving, handleChange, handleSubmit };
};
