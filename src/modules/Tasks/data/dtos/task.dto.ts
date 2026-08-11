import { TaskPriority } from "../../domain/entities/task.entity";

export interface TaskDtoResponse {
  id: string;
  ownerId: string;
  titulo: string;
  descripcion?: string;
  completada: boolean;
  prioridad: TaskPriority;
  fecha: string;
  imagenUrl?: string;
}

export interface TaskDtoRequest {
  titulo: string;
  descripcion?: string;
  completada: boolean;
  prioridad: TaskPriority;
  fecha: string;
  imagenUrl?: string;
}
