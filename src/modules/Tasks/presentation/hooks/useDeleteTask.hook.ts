import { useState } from "react";
import { Alert } from "react-native";
import { useTaskDependencies } from "../contexts/task-dependencies.context";

export const useDeleteTask = (onDeleted?: () => void) => {
  const { deleteTaskUseCase } = useTaskDependencies();
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = (id: string) => {
    Alert.alert("Eliminar tarea", "¿Seguro que deseas eliminar esta tarea?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          setIsDeleting(true);
          try {
            await deleteTaskUseCase.execute(id);
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
