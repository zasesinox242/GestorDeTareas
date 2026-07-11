import AsyncStorage from '@react-native-async-storage/async-storage';

import { Task } from '../models/Task';
import { SAMPLE_TASKS } from '../data/sampleTasks';
import { buildTasksKey } from './storageKeys';

// Lógica de negocio de las tareas: dónde se guardan y cómo se calculan
// las métricas de productividad. Sin nada de React ni de UI aquí.

// Carga las tareas de un usuario. Si es la primera vez que entra
// (no hay nada guardado todavía), se "siembra" con las tareas de ejemplo.
export const loadTasksForUser = async (email: string): Promise<Task[]> => {
  const raw = await AsyncStorage.getItem(buildTasksKey(email));

  if (raw === null) {
    return SAMPLE_TASKS;
  }

  return JSON.parse(raw) as Task[];
};

export const saveTasksForUser = async (
  email: string,
  tasks: Task[]
): Promise<void> => {
  await AsyncStorage.setItem(buildTasksKey(email), JSON.stringify(tasks));
};

export interface ProductivityStats {
  total: number;
  completed: number;
  percent: number; // 0 - 100, redondeado
}

// Calcula el % de tareas finalizadas sobre el total, usado en la barra
// de productividad de la pantalla de Ajustes.
export const computeProductivity = (tasks: Task[]): ProductivityStats => {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === 'FINALIZADA').length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { total, completed, percent };
};
