import { TaskEntity } from "../entities/task.entity";
import { TaskRepository } from "../repositories/task.repository";

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(task: TaskEntity, ownerId: string): Promise<TaskEntity> {
    return this.taskRepository.updateTask(task, ownerId);
  }
}
