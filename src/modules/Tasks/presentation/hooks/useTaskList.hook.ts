import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { TaskEntity } from "../../domain/entities/task.entity";
import { getTasksUseCase, updateTaskUseCase } from "../../di/task.dependencies";
import { useAuthContext } from "@/modules/Auth/presentation/contexts/auth.context";

export const useTaskList = () => {
  const { user } = useAuthContext();
  const [tasks, setTasks] = useState<TaskEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const loadTasks = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    setIsError(false);
    try {
      const result = await getTasksUseCase.execute(user.id);
      setTasks(result);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Recarga la lista cada vez que la pantalla vuelve a estar en foco
  // (por ejemplo, al volver de crear/editar una tarea).
  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks]),
  );

  const toggleComplete = async (task: TaskEntity) => {
    const updated = { ...task, completada: !task.completada };
    setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    try {
      await updateTaskUseCase.execute(updated);
    } catch {
      loadTasks(); // revertir si falla
    }
  };

  return { tasks, isLoading, isError, reload: loadTasks, toggleComplete };
};
