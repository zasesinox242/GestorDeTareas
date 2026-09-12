import { useState } from "react";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { TaskEntity } from "../../domain/entities/task.entity";
import { useAuthContext } from "@/modules/Auth/presentation/contexts/auth.context";
import { scheduleTaskDueNotification } from "@/core/services/taskNotifications.service";
import { useTaskImage } from "./useTaskImage.hook";
import { useTaskDependencies } from "../contexts/task-dependencies.context";

const EMPTY_TASK: TaskEntity = {
  titulo: "",
  descripcion: "",
  completada: false,
  prioridad: "media",
};

export const useNewTask = () => {
  const router = useRouter();
  const { user } = useAuthContext();
  const { createTaskUseCase, updateTaskUseCase } = useTaskDependencies();
  const { pickAndUpload } = useTaskImage(user?.id ?? "");

  const [task, setTask] = useState<TaskEntity>(EMPTY_TASK);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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
      // Una vez creada, la tarea ya tiene id: se queda en esta pantalla para
      // permitir adjuntar una foto (useTaskImage necesita el id) antes de volver.
      const created = await createTaskUseCase.execute(task, user.id);
      setTask(created);
      await scheduleTaskDueNotification(created);
    } catch (error: any) {
      Alert.alert("Error", error?.message ?? "No se pudo crear la tarea");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePickImage = async () => {
    if (!task.id || !user?.id) return;

    setIsUploadingImage(true);
    try {
      const imagenUrl = await pickAndUpload(task.id);
      if (imagenUrl) {
        const updated = await updateTaskUseCase.execute({ ...task, imagenUrl }, user.id);
        setTask(updated);
      }
    } catch (error: any) {
      Alert.alert("Error", error?.message ?? "No se pudo subir la imagen");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleFinish = () => router.back();

  return {
    task,
    isSaving,
    isUploadingImage,
    isCreated: !!task.id,
    handleChange,
    handleSubmit,
    handlePickImage,
    handleFinish,
  };
};
