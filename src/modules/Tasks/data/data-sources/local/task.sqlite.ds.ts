import { type SQLiteDatabase } from "expo-sqlite";
import { TaskEntity } from "../../../domain/entities/task.entity";
import { TaskDtoResponse } from "../../dtos/task.dto";
import { TaskModel } from "../../models/task.model";
import { TaskLocalDataSource } from "./task.local.ds";

type TaskRow = Omit<TaskDtoResponse, "completada" | "descripcion" | "imagenUrl" | "fechaVencimiento"> & {
  completada: number;
  descripcion: string | null;
  imagenUrl: string | null;
  fechaVencimiento: string | null;
  synced: number;
};

const rowToModel = (row: TaskRow): TaskModel =>
  TaskModel.fromDTO({
    ...row,
    completada: row.completada === 1,
    descripcion: row.descripcion ?? undefined,
    imagenUrl: row.imagenUrl ?? undefined,
    fechaVencimiento: row.fechaVencimiento ?? undefined,
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

  async getTaskById(id: string, ownerId: string): Promise<TaskModel | null> {
    const row = await this.db.getFirstAsync<TaskRow>(
      "SELECT * FROM tasks WHERE id = ? AND ownerId = ?",
      [id, ownerId],
    );
    return row ? rowToModel(row) : null;
  }

  async createTask(task: TaskEntity, ownerId: string): Promise<TaskModel> {
    const dto = TaskModel.fromEntity(task).toDTO();
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    await this.db.runAsync(
      `INSERT INTO tasks
        (id, ownerId, titulo, descripcion, completada, prioridad, fecha, fechaVencimiento, imagenUrl, synced)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        id,
        ownerId,
        dto.titulo,
        dto.descripcion ?? null,
        dto.completada ? 1 : 0,
        dto.prioridad,
        dto.fecha,
        dto.fechaVencimiento ?? null,
        dto.imagenUrl ?? null,
      ],
    );

    const created = await this.getTaskById(id, ownerId);
    if (!created) throw new Error("No se pudo recuperar la tarea creada");
    return created;
  }

  async updateTask(task: TaskEntity, ownerId: string): Promise<TaskModel> {
    if (!task.id) throw new Error("Task ID is required");

    const dto = TaskModel.fromEntity(task).toDTO();
    const result = await this.db.runAsync(
      `UPDATE tasks
       SET titulo = ?, descripcion = ?, completada = ?, prioridad = ?, fecha = ?, fechaVencimiento = ?, imagenUrl = ?, synced = 0
       WHERE id = ? AND ownerId = ?`,
      [
        dto.titulo,
        dto.descripcion ?? null,
        dto.completada ? 1 : 0,
        dto.prioridad,
        dto.fecha,
        dto.fechaVencimiento ?? null,
        dto.imagenUrl ?? null,
        task.id,
        ownerId,
      ],
    );

    if (result.changes === 0) throw new Error("Tarea no encontrada");

    const updated = await this.getTaskById(task.id, ownerId);
    if (!updated) throw new Error("No se pudo recuperar la tarea actualizada");
    return updated;
  }

  async deleteTask(id: string, ownerId: string): Promise<TaskModel> {
    const row = await this.db.getFirstAsync<TaskRow>(
      "SELECT * FROM tasks WHERE id = ? AND ownerId = ?",
      [id, ownerId],
    );
    if (!row) throw new Error("Tarea no encontrada");

    // Registrar la baja ANTES de borrar, para poder replicarla en Firestore.
    await this.db.runAsync(
      "INSERT OR REPLACE INTO pending_deletes (id, ownerId) VALUES (?, ?)",
      [id, row.ownerId],
    );
    await this.db.runAsync("DELETE FROM tasks WHERE id = ? AND ownerId = ?", [id, ownerId]);
    return rowToModel(row);
  }

  // --- Sincronización ---

  async getPendingSyncTasks(ownerId: string): Promise<TaskModel[]> {
    const rows = await this.db.getAllAsync<TaskRow>(
      "SELECT * FROM tasks WHERE ownerId = ? AND synced = 0",
      [ownerId],
    );
    return rows.map(rowToModel);
  }

  async markAsSynced(id: string): Promise<void> {
    await this.db.runAsync("UPDATE tasks SET synced = 1 WHERE id = ?", [id]);
  }

  async getPendingDeletes(ownerId: string): Promise<string[]> {
    const rows = await this.db.getAllAsync<{ id: string }>(
      "SELECT id FROM pending_deletes WHERE ownerId = ?",
      [ownerId],
    );
    return rows.map((r) => r.id);
  }

  async clearPendingDelete(id: string): Promise<void> {
    await this.db.runAsync("DELETE FROM pending_deletes WHERE id = ?", [id]);
  }
}