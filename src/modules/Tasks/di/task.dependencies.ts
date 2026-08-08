import { TaskLocalDataSourceImpl } from "../data/data-sources/local/task.local.ds";
import { TaskRepositoryImpl } from "../data/repositories/task.repository.impl";
import { CreateTaskUseCase } from "../domain/use-cases/createTask.use-case";
import { DeleteTaskUseCase } from "../domain/use-cases/deleteTask.use-case";
import { GetTaskByIdUseCase } from "../domain/use-cases/getTaskById.use-case";
import { GetTasksUseCase } from "../domain/use-cases/getTasks.use-case";
import { UpdateTaskUseCase } from "../domain/use-cases/updateTask.use-case";

// Data sources
const taskLocalDataSource = new TaskLocalDataSourceImpl();

// Repositories
const taskRepository = new TaskRepositoryImpl(taskLocalDataSource);

// Use Cases
export const getTasksUseCase = new GetTasksUseCase(taskRepository);
export const getTaskByIdUseCase = new GetTaskByIdUseCase(taskRepository);
export const createTaskUseCase = new CreateTaskUseCase(taskRepository);
export const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
export const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
