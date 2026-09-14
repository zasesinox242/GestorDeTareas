import { useState } from "react";
import { useAuthContext } from "@/modules/Auth/presentation/contexts/auth.context";
import { useConfirm } from "@/core/contexts/confirm.context";
import { useToast } from "@/core/contexts/toast.context";
import { cancelTaskDueNotification } from "@/core/services/taskNotifications.service";
import { useTaskDependencies } from "../contexts/task-dependencies.context";

export const useDeleteTask = (onDeleted?: () => void) => {
  const { user } = useAuthContext();
  const confirm = useConfirm();
  const { showToast } = useToast();
  const { deleteTaskUseCase } = useTaskDependencies();
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async (id: string) => {
    const ownerId = user?.id;
    if (!ownerId) return;

    const confirmed = await confirm({
      title: "Eliminar tarea",
      message: "¿Seguro que deseas eliminar esta tarea?",
      confirmText: "Eliminar",
      destructive: true,
    });
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deleteTaskUseCase.execute(id, ownerId);
      await cancelTaskDueNotification(id);
      showToast("Tarea eliminada", "success");
      onDeleted?.();
    } catch (error: any) {
      showToast(error?.message ?? "No se pudo eliminar la tarea", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, confirmDelete };
};
