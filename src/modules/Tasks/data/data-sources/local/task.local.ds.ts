import { TaskEntity } from "../../../domain/entities/task.entity";
import { TaskModel } from "../../models/task.model";

export interface TaskLocalDataSource {
  getTasks: (ownerId: string) => Promise<TaskModel[]>;
  getTaskById: (id: string, ownerId: string) => Promise<TaskModel | null>;
  createTask: (task: TaskEntity, ownerId: string) => Promise<TaskModel>;
  updateTask: (task: TaskEntity, ownerId: string) => Promise<TaskModel>;
  deleteTask: (id: string, ownerId: string) => Promise<TaskModel>;

  // --- Sincronización ---
  getPendingSyncTasks: (ownerId: string) => Promise<TaskModel[]>;
  markAsSynced: (id: string) => Promise<void>;
  getPendingDeletes: (ownerId: string) => Promise<string[]>;
  clearPendingDelete: (id: string) => Promise<void>;
}