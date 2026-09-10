import { TaskEntity } from "../entities/task.entity";
import { TaskRepository } from "../repositories/task.repository";

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id: string, ownerId: string): Promise<TaskEntity> {
    return this.taskRepository.deleteTask(id, ownerId);
  }
}
