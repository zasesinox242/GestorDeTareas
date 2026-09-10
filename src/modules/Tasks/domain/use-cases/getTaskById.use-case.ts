import { TaskEntity } from "../entities/task.entity";
import { TaskRepository } from "../repositories/task.repository";

export class GetTaskByIdUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id: string, ownerId: string): Promise<TaskEntity | null> {
    return this.taskRepository.getTaskById(id, ownerId);
  }
}
