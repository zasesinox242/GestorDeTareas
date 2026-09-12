import { TaskEntity, TaskPriority } from "../../domain/entities/task.entity";
import { TaskDtoRequest, TaskDtoResponse } from "../dtos/task.dto";

export class TaskModel implements TaskEntity {
  constructor(
    public titulo: string,
    public completada: boolean,
    public prioridad: TaskPriority,
    public id?: string,
    public descripcion?: string,
    public fecha?: string,
    public imagenUrl?: string,
    public fechaVencimiento?: string,
  ) {}

  static fromDTO(dto: TaskDtoResponse): TaskModel {
    return new TaskModel(
      dto.titulo,
      dto.completada,
      dto.prioridad,
      dto.id,
      dto.descripcion,
      dto.fecha,
      dto.imagenUrl,
      dto.fechaVencimiento,
    );
  }

  static fromEntity(entity: TaskEntity): TaskModel {
    return new TaskModel(
      entity.titulo,
      entity.completada,
      entity.prioridad,
      entity.id,
      entity.descripcion,
      entity.fecha,
      entity.imagenUrl,
      entity.fechaVencimiento,
    );
  }

  toDTO(): TaskDtoRequest {
    return {
      titulo: this.titulo,
      descripcion: this.descripcion,
      completada: this.completada,
      prioridad: this.prioridad,
      fecha: this.fecha ?? new Date().toISOString(),
      fechaVencimiento: this.fechaVencimiento,
      imagenUrl: this.imagenUrl,
    };
  }
}
