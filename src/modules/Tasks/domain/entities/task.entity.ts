export type TaskPriority = "baja" | "media" | "alta";

export interface TaskEntity {
  id?: string;
  titulo: string;
  descripcion?: string;
  completada: boolean;
  prioridad: TaskPriority;
  fecha?: string;
  imagenUrl?: string;
}
