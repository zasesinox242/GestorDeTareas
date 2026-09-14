import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { TaskEntity } from "../../domain/entities/task.entity";
import { useToast } from "@/core/contexts/toast.context";
import { useAuthContext } from "@/modules/Auth/presentation/contexts/auth.context";
import { scheduleTaskDueNotification } from "@/core/services/taskNotifications.service";
import { useDeleteTask } from "./useDeleteTask.hook";
import { useTaskImage } from "./useTaskImage.hook";
import { useTaskDependencies } from "../contexts/task-dependencies.context";

export const useEditTask = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthContext();
  const { showToast } = useToast();
  const { getTaskByIdUseCase, updateTaskUseCase } = useTaskDependencies();
  const { pickAndUpload } = useTaskImage(user?.id ?? "");

  const [task, setTask] = useState<TaskEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const { confirmDelete } = useDeleteTask(() => router.replace("/tasks"));

  useEffect(() => {
    if (!id || !user?.id) return;
    getTaskByIdUseCase
      .execute(id, user.id)
      .then(setTask)
      .finally(() => setIsLoading(false));
  }, [getTaskByIdUseCase, id, user?.id]);

  const handleChange = <K extends keyof TaskEntity>(field: K, value: TaskEntity[K]) => {
    setTask((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSubmit = async () => {
    if (!task || !user?.id) return;

    setIsSaving(true);
    try {
      const updated = await updateTaskUseCase.execute(task, user.id);
      await scheduleTaskDueNotification(updated);
      showToast("Tarea actualizada", "success");
      router.back();
    } catch (error: any) {
      showToast(error?.message ?? "No se pudo actualizar la tarea", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (task?.id) confirmDelete(task.id);
  };

  const handlePickImage = async () => {
    if (!task?.id || !user?.id) return;

    setIsUploadingImage(true);
    try {
      const imagenUrl = await pickAndUpload(task.id);
      if (imagenUrl) {
        const updated = await updateTaskUseCase.execute({ ...task, imagenUrl }, user.id);
        setTask(updated);
      }
    } catch (error: any) {
      showToast(error?.message ?? "No se pudo subir la imagen", "error");
    } finally {
      setIsUploadingImage(false);
    }
  };

  return {
    task,
    isLoading,
    isSaving,
    isUploadingImage,
    handleChange,
    handleSubmit,
    handleDelete,
    handlePickImage,
  };
};
