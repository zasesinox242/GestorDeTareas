import { TaskEntity } from "../entities/task.entity";

export interface TaskRepository {
  getTasks: (ownerId: string) => Promise<TaskEntity[]>;
  getTaskById: (id: string) => Promise<TaskEntity | null>;
  createTask: (task: TaskEntity, ownerId: string) => Promise<TaskEntity>;
  updateTask: (task: TaskEntity) => Promise<TaskEntity>;
  deleteTask: (id: string) => Promise<TaskEntity>;
}
