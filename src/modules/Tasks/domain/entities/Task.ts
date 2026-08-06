// Modelo de datos de una Tarea
// Define la estructura mínima que debe cumplir toda tarea dentro de la app

// Sólo se manejan dos estados: pendiente o finalizada. El paso de uno a
// otro se hace exclusivamente con el checkbox de "completar" del listado,
// no desde el formulario de edición.
export type TaskStatus = 'PENDIENTE' | 'FINALIZADA';
export type TaskPriority = 'BAJA' | 'MEDIA' | 'ALTA';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
}

// Catálogos usados para pintar los selectores/chips en las pantallas
export const TASK_STATUSES: TaskStatus[] = ['PENDIENTE', 'FINALIZADA'];
export const TASK_PRIORITIES: TaskPriority[] = ['BAJA', 'MEDIA', 'ALTA'];
