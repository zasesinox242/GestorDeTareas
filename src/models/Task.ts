// Modelo de datos de una Tarea
// Define la estructura mínima que debe cumplir toda tarea dentro de la app

export type TaskStatus = 'PENDIENTE' | 'EN_PROCESO' | 'FINALIZADA';
export type TaskPriority = 'BAJA' | 'MEDIA' | 'ALTA';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
}

// Catálogos usados para pintar los selectores/chips en las pantallas
export const TASK_STATUSES: TaskStatus[] = ['PENDIENTE', 'EN_PROCESO', 'FINALIZADA'];
export const TASK_PRIORITIES: TaskPriority[] = ['BAJA', 'MEDIA', 'ALTA'];
