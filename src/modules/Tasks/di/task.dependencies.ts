import { type SQLiteDatabase } from "expo-sqlite";
import { TaskSqliteDataSourceImpl } from "../data/data-sources/local/task.sqlite.ds";
import { TaskRepositoryImpl } from "../data/repositories/task.repository.impl";
import { CreateTaskUseCase } from "../domain/use-cases/createTask.use-case";
import { DeleteTaskUseCase } from "../domain/use-cases/deleteTask.use-case";
import { GetTaskByIdUseCase } from "../domain/use-cases/getTaskById.use-case";
import { GetTasksUseCase } from "../domain/use-cases/getTasks.use-case";
import { UpdateTaskUseCase } from "../domain/use-cases/updateTask.use-case";

export const buildTaskDependencies = (db: SQLiteDatabase) => {
  const taskLocalDataSource = new TaskSqliteDataSourceImpl(db);
  const taskRepository = new TaskRepositoryImpl(taskLocalDataSource);

  return {
    getTasksUseCase: new GetTasksUseCase(taskRepository),
    getTaskByIdUseCase: new GetTaskByIdUseCase(taskRepository),
    createTaskUseCase: new CreateTaskUseCase(taskRepository),
    updateTaskUseCase: new UpdateTaskUseCase(taskRepository),
    deleteTaskUseCase: new DeleteTaskUseCase(taskRepository),
  };
};

export type TaskDependencies = ReturnType<typeof buildTaskDependencies>;
