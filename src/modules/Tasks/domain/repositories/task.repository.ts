import { TaskEntity } from "../entities/task.entity";

export interface TaskRepository {
  getTasks: (ownerId: string) => Promise<TaskEntity[]>;
  getTaskById: (id: string, ownerId: string) => Promise<TaskEntity | null>;
  createTask: (task: TaskEntity, ownerId: string) => Promise<TaskEntity>;
  updateTask: (task: TaskEntity, ownerId: string) => Promise<TaskEntity>;
  deleteTask: (id: string, ownerId: string) => Promise<TaskEntity>;
}
