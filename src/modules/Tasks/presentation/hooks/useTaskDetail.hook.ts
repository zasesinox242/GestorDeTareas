import { useCallback, useState } from "react";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { TaskEntity } from "../../domain/entities/task.entity";
import { useTaskDependencies } from "../contexts/task-dependencies.context";

export const useTaskDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTaskByIdUseCase } = useTaskDependencies();
  const [task, setTask] = useState<TaskEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      setIsLoading(true);
      getTaskByIdUseCase
        .execute(id)
        .then(setTask)
        .finally(() => setIsLoading(false));
    }, [getTaskByIdUseCase, id]),
  );

  return { id, task, isLoading };
};
