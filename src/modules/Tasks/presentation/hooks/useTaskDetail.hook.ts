import { useCallback, useState } from "react";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { TaskEntity } from "../../domain/entities/task.entity";
import { getTaskByIdUseCase } from "../../di/task.dependencies";

export const useTaskDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
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
    }, [id]),
  );

  return { id, task, isLoading };
};
