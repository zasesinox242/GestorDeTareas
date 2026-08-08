import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert } from "react-native";
import { TaskEntity } from "../../domain/entities/task.entity";
import { getTaskByIdUseCase, updateTaskUseCase } from "../../di/task.dependencies";
import { useDeleteTask } from "./useDeleteTask.hook";

export const useEditTask = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [task, setTask] = useState<TaskEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { confirmDelete } = useDeleteTask(() => router.replace("/tasks"));

  useEffect(() => {
    if (!id) return;
    getTaskByIdUseCase.execute(id).then(setTask).finally(() => setIsLoading(false));
  }, [id]);

  const handleChange = <K extends keyof TaskEntity>(field: K, value: TaskEntity[K]) => {
    setTask((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSubmit = async () => {
    if (!task) return;

    setIsSaving(true);
    try {
      await updateTaskUseCase.execute(task);
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error?.message ?? "No se pudo actualizar la tarea");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (task?.id) confirmDelete(task.id);
  };

  return { task, isLoading, isSaving, handleChange, handleSubmit, handleDelete };
};
