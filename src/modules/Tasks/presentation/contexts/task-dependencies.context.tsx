import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
} from "react";
import { useSQLiteContext } from "expo-sqlite";
import {
  buildTaskDependencies,
  TaskDependencies,
} from "../../di/task.dependencies";

const TaskDependenciesContext = createContext<TaskDependencies | null>(null);

export const TaskDependenciesProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const db = useSQLiteContext();
  const dependencies = useMemo(() => buildTaskDependencies(db), [db]);

  return (
    <TaskDependenciesContext.Provider value={dependencies}>
      {children}
    </TaskDependenciesContext.Provider>
  );
};

export const useTaskDependencies = (): TaskDependencies => {
  const context = useContext(TaskDependenciesContext);

  if (!context) {
    throw new Error(
      "useTaskDependencies debe usarse dentro de TaskDependenciesProvider",
    );
  }

  return context;
};
