import { useState } from "react";
import { Alert } from "react-native";
import { useAuthContext } from "@/modules/Auth/presentation/contexts/auth.context";
import { useTaskDependencies } from "../contexts/task-dependencies.context";

export const useDeleteTask = (onDeleted?: () => void) => {
  const { user } = useAuthContext();
  const { deleteTaskUseCase } = useTaskDependencies();
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = (id: string) => {
    const ownerId = user?.id;
    if (!ownerId) return;

    Alert.alert("Eliminar tarea", "¿Seguro que deseas eliminar esta tarea?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          setIsDeleting(true);
          try {
            await deleteTaskUseCase.execute(id, ownerId);
            onDeleted?.();
          } catch (error: any) {
            Alert.alert("Error", error?.message ?? "No se pudo eliminar la tarea");
          } finally {
            setIsDeleting(false);
          }
        },
      },
    ]);
  };

  return { isDeleting, confirmDelete };
};
