import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import { TaskEntity } from "../../domain/entities/task.entity";
import { useAuthContext } from "@/modules/Auth/presentation/contexts/auth.context";
import { scheduleTaskDueNotification } from "@/core/services/taskNotifications.service";
import { useTaskDependencies } from "../contexts/task-dependencies.context";

export const useTaskList = () => {
  const { user } = useAuthContext();
  const { getTasksUseCase, updateTaskUseCase } = useTaskDependencies();
  const [tasks, setTasks] = useState<TaskEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  // Evita re-disparar la celebración en cada render; solo nos interesa el
  // instante exacto en que se pasa de "no todas completas" a "todas completas".
  const wasAllCompleted = useRef(false);

  const loadTasks = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    setIsError(false);
    try {
      const result = await getTasksUseCase.execute(user.id);
      setTasks(result);
      wasAllCompleted.current = result.length > 0 && result.every((t) => t.completada);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [getTasksUseCase, user?.id]);

  // Recarga la lista cada vez que la pantalla vuelve a estar en foco
  // (por ejemplo, al volver de crear/editar una tarea).
  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks]),
  );

  const toggleComplete = async (task: TaskEntity) => {
    if (!user?.id) return;
    const updated = { ...task, completada: !task.completada };
    const nextTasks = tasks.map((t) => (t.id === task.id ? updated : t));
    setTasks(nextTasks);

    const nowAllCompleted = nextTasks.length > 0 && nextTasks.every((t) => t.completada);
    if (nowAllCompleted && !wasAllCompleted.current) setShowCelebration(true);
    wasAllCompleted.current = nowAllCompleted;

    try {
      await updateTaskUseCase.execute(updated, user.id);
      await scheduleTaskDueNotification(updated);
    } catch {
      loadTasks(); // revertir si falla
    }
  };

  return {
    tasks,
    isLoading,
    isError,
    reload: loadTasks,
    toggleComplete,
    showCelebration,
    dismissCelebration: () => setShowCelebration(false),
  };
};
