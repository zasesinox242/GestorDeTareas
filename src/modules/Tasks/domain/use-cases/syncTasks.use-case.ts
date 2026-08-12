import { TaskLocalDataSource } from "../../data/data-sources/local/task.local.ds";
import { TaskRemoteDataSource } from "../../data/data-sources/remote/task.firestore.ds";

export class SyncTasksUseCase {
  constructor(
    private readonly local: TaskLocalDataSource,
    private readonly remote: TaskRemoteDataSource,
  ) {}

  async execute(ownerId: string): Promise<void> {
    // 1) Subir tareas creadas/editadas mientras no había conexión.
    const pending = await this.local.getPendingSyncTasks(ownerId);
    for (const task of pending) {
      try {
        await this.remote.pushTask(task, ownerId);
        await this.local.markAsSynced(task.id!);
      } catch {
        // Si falla una, seguimos con las demás; se reintentará en el próximo sync.
      }
    }

    // 2) Replicar las bajas hechas sin conexión.
    const pendingDeletes = await this.local.getPendingDeletes(ownerId);
    for (const id of pendingDeletes) {
      try {
        await this.remote.deleteTask(id);
        await this.local.clearPendingDelete(id);
      } catch {
        // Se reintenta luego.
      }
    }
  }
}