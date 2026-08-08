import { TaskEntity } from "../entities/task.entity";
import { TaskRepository } from "../repositories/task.repository";

export class GetTasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(ownerId: string): Promise<TaskEntity[]> {
    return this.taskRepository.getTasks(ownerId);
  }
}
