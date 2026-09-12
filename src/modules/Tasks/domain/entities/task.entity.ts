export type TaskPriority = "baja" | "media" | "alta";

export interface TaskEntity {
  id?: string;
  titulo: string;
  descripcion?: string;
  completada: boolean;
  prioridad: TaskPriority;
  fecha?: string;
  /** Fecha y hora límite (ISO 8601), opcional. Se usa para el indicador de vencimiento y la notificación local. */
  fechaVencimiento?: string;
  imagenUrl?: string;
}
