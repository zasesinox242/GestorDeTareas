import { type SQLiteDatabase } from "expo-sqlite";
import { TaskEntity } from "../../../domain/entities/task.entity";
import { TaskDtoResponse } from "../../dtos/task.dto";
import { TaskModel } from "../../models/task.model";
import { TaskLocalDataSource } from "./task.local.ds";

type TaskRow = Omit<TaskDtoResponse, "completada" | "descripcion" | "imagenUrl"> & {
  completada: number;
  descripcion: string | null;
  imagenUrl: string | null;
};

const rowToModel = (row: TaskRow): TaskModel =>
  TaskModel.fromDTO({
    ...row,
    completada: row.completada === 1,
    descripcion: row.descripcion ?? undefined,
    imagenUrl: row.imagenUrl ?? undefined,
  });

export class TaskSqliteDataSourceImpl implements TaskLocalDataSource {
  constructor(private readonly db: SQLiteDatabase) {}

  async getTasks(ownerId: string): Promise<TaskModel[]> {
    const rows = await this.db.getAllAsync<TaskRow>(
      "SELECT * FROM tasks WHERE ownerId = ? ORDER BY fecha DESC",
      [ownerId],
    );

    return rows.map(rowToModel);
  }

  async getTaskById(id: string): Promise<TaskModel | null> {
    const row = await this.db.getFirstAsync<TaskRow>(
      "SELECT * FROM tasks WHERE id = ?",
      [id],
    );

    return row ? rowToModel(row) : null;
  }

  async createTask(task: TaskEntity, ownerId: string): Promise<TaskModel> {
    const dto = TaskModel.fromEntity(task).toDTO();
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    await this.db.runAsync(
      `INSERT INTO tasks
        (id, ownerId, titulo, descripcion, completada, prioridad, fecha, imagenUrl)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        ownerId,
        dto.titulo,
        dto.descripcion ?? null,
        dto.completada ? 1 : 0,
        dto.prioridad,
        dto.fecha,
        dto.imagenUrl ?? null,
      ],
    );

    const created = await this.getTaskById(id);
    if (!created) throw new Error("No se pudo recuperar la tarea creada");
    return created;
  }

  async updateTask(task: TaskEntity): Promise<TaskModel> {
    if (!task.id) throw new Error("Task ID is required");

    const dto = TaskModel.fromEntity(task).toDTO();
    const result = await this.db.runAsync(
      `UPDATE tasks
       SET titulo = ?, descripcion = ?, completada = ?, prioridad = ?, fecha = ?, imagenUrl = ?
       WHERE id = ?`,
      [
        dto.titulo,
        dto.descripcion ?? null,
        dto.completada ? 1 : 0,
        dto.prioridad,
        dto.fecha,
        dto.imagenUrl ?? null,
        task.id,
      ],
    );

    if (result.changes === 0) throw new Error("Tarea no encontrada");

    const updated = await this.getTaskById(task.id);
    if (!updated) throw new Error("No se pudo recuperar la tarea actualizada");
    return updated;
  }

  async deleteTask(id: string): Promise<TaskModel> {
    const existing = await this.getTaskById(id);
    if (!existing) throw new Error("Tarea no encontrada");

    await this.db.runAsync("DELETE FROM tasks WHERE id = ?", [id]);
    return existing;
  }
}
