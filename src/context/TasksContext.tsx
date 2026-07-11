import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Task, TaskPriority } from '../models/Task';
import { useAuth } from './AuthContext';
import {
  computeProductivity,
  loadTasksForUser,
  ProductivityStats,
  saveTasksForUser,
} from '../services/taskService';

export interface NewTaskInput {
  title: string;
  description: string;
  priority: TaskPriority;
}

interface TasksContextValue {
  tasks: Task[];
  isLoading: boolean;
  productivity: ProductivityStats;
  addTask: (data: NewTaskInput) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskCompleted: (taskId: string) => void;
}

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

// Toda la lógica de negocio del listado de tareas vive aquí: cargarlas
// desde almacenamiento según el usuario logueado, guardarlas cuando cambian,
// y calcular la productividad. Las pantallas sólo leen/disparan acciones.
export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cada vez que cambia el usuario logueado (login/logout) se recarga
  // el listado correspondiente a esa cuenta.
  useEffect(() => {
    let isMounted = true;

    if (!user) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    loadTasksForUser(user.email)
      .then((loaded) => {
        if (isMounted) {
          setTasks(loaded);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Helper interno: aplica un cambio al listado en memoria y lo persiste.
  const persist = useCallback(
    (updater: (prev: Task[]) => Task[]) => {
      setTasks((prev) => {
        const next = updater(prev);
        if (user) {
          saveTasksForUser(user.email, next);
        }
        return next;
      });
    },
    [user]
  );

  const addTask = useCallback(
    (data: NewTaskInput) => {
      const newTask: Task = {
        id: Date.now().toString(),
        title: data.title,
        description: data.description,
        status: 'PENDIENTE',
        priority: data.priority,
      };
      persist((prev) => [newTask, ...prev]);
    },
    [persist]
  );

  const updateTask = useCallback(
    (updatedTask: Task) => {
      persist((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    },
    [persist]
  );

  const deleteTask = useCallback(
    (taskId: string) => {
      persist((prev) => prev.filter((task) => task.id !== taskId));
    },
    [persist]
  );

  // Marca/desmarca una tarea como completada (FINALIZADA <-> PENDIENTE),
  // que es lo que alimenta el checkbox del listado principal.
  const toggleTaskCompleted = useCallback(
    (taskId: string) => {
      persist((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: task.status === 'FINALIZADA' ? 'PENDIENTE' : 'FINALIZADA',
              }
            : task
        )
      );
    },
    [persist]
  );

  const productivity = useMemo(() => computeProductivity(tasks), [tasks]);

  const value = useMemo<TasksContextValue>(
    () => ({
      tasks,
      isLoading,
      productivity,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskCompleted,
    }),
    [tasks, isLoading, productivity, addTask, updateTask, deleteTask, toggleTaskCompleted]
  );

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
};

export const useTasks = (): TasksContextValue => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks debe usarse dentro de un TasksProvider');
  }
  return context;
};
