import { TaskEntity } from "../../domain/entities/task.entity";
import { TaskRepository } from "../../domain/repositories/task.repository";
import { TaskLocalDataSource } from "../data-sources/local/task.local.ds";

/**
 * TODO (Firebase Firestore + sincronización):
 *   Este repositorio hoy solo habla con el data source LOCAL.
 *   Cuando se integre Firebase, agregar un TaskRemoteDataSource (Firestore) y:
 *     1) Seguir escribiendo primero en local (para que offline funcione).
 *     2) Si hay conexión, sincronizar con Firestore.
 *     3) Evitar duplicados usando el id local como referencia hasta que el
 *        doc remoto se cree.
 */
export class TaskRepositoryImpl implements TaskRepository {
  constructor(private readonly taskLocalDataSource: TaskLocalDataSource) {}

  async getTasks(ownerId: string): Promise<TaskEntity[]> {
    return this.taskLocalDataSource.getTasks(ownerId);
  }

  async getTaskById(id: string): Promise<TaskEntity | null> {
    return this.taskLocalDataSource.getTaskById(id);
  }

  async createTask(task: TaskEntity, ownerId: string): Promise<TaskEntity> {
    return this.taskLocalDataSource.createTask(task, ownerId);
  }

  async updateTask(task: TaskEntity): Promise<TaskEntity> {
    return this.taskLocalDataSource.updateTask(task);
  }

  async deleteTask(id: string): Promise<TaskEntity> {
    return this.taskLocalDataSource.deleteTask(id);
  }
}
