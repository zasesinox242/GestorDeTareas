import AsyncStorage from "@react-native-async-storage/async-storage";
import { TaskEntity } from "../../../domain/entities/task.entity";
import { TaskDtoResponse } from "../../dtos/task.dto";
import { TaskModel } from "../../models/task.model";

/**
 * Implementación TEMPORAL de persistencia local, mientras no se integra SQLite.
 * Guarda las tareas como JSON en AsyncStorage, así la app YA funciona sin
 * conexión, solo que aún no usa SQLite.
 *
 * Las tareas SÍ están separadas por usuario (ownerId), para que cada cuenta
 * vea solo las suyas.
 *
 * TODO (integración SQLite):
 *   Reemplazar el contenido de estos métodos por consultas SQL usando
 *   `expo-sqlite` (SQLiteProvider en el _layout raíz + useSQLiteContext en
 *   este data source, igual que en el repo de referencia del profesor,
 *   rama feature/expo-sqlite). Crear una tabla `tasks` con estas columnas
 *   (incluyendo ownerId) y un WHERE ownerId = ? en los SELECT.
 * TODO (Firebase): ownerId hoy es el id local (AsyncStorage) del usuario;
 *   cuando se integre Firebase Auth, pasará a ser auth.currentUser?.uid.
 *   La interfaz pública (TaskLocalDataSource) NO debería cambiar, así el
 *   resto de capas (repository, use-cases, presentation) no se tocan.
 */
const TASKS_KEY = "@tasks/list";

export interface TaskLocalDataSource {
  getTasks: (ownerId: string) => Promise<TaskModel[]>;
  getTaskById: (id: string) => Promise<TaskModel | null>;
  createTask: (task: TaskEntity, ownerId: string) => Promise<TaskModel>;
  updateTask: (task: TaskEntity) => Promise<TaskModel>;
  deleteTask: (id: string) => Promise<TaskModel>;
}

export class TaskLocalDataSourceImpl implements TaskLocalDataSource {
  private async getAll(): Promise<TaskDtoResponse[]> {
    const raw = await AsyncStorage.getItem(TASKS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  private async saveAll(tasks: TaskDtoResponse[]): Promise<void> {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }

  async getTasks(ownerId: string): Promise<TaskModel[]> {
    const tasks = await this.getAll();
    return tasks.filter((t) => t.ownerId === ownerId).map(TaskModel.fromDTO);
  }

  async getTaskById(id: string): Promise<TaskModel | null> {
    const tasks = await this.getAll();
    const found = tasks.find((t) => t.id === id);
    return found ? TaskModel.fromDTO(found) : null;
  }

  async createTask(task: TaskEntity, ownerId: string): Promise<TaskModel> {
    const tasks = await this.getAll();
    const model = TaskModel.fromEntity(task);
    const dto = model.toDTO();
    const newTask: TaskDtoResponse = {
      ...dto,
      id: Date.now().toString(),
      ownerId,
    };

    await this.saveAll([...tasks, newTask]);
    return TaskModel.fromDTO(newTask);
  }

  async updateTask(task: TaskEntity): Promise<TaskModel> {
    if (!task.id) {
      throw new Error("Task ID is required");
    }

    const tasks = await this.getAll();
    const model = TaskModel.fromEntity(task);
    const dto = model.toDTO();

    const updated = tasks.map((t) =>
      t.id === task.id ? { ...t, ...dto, id: t.id, ownerId: t.ownerId } : t,
    );

    await this.saveAll(updated);
    return TaskModel.fromDTO(updated.find((t) => t.id === task.id)!);
  }

  async deleteTask(id: string): Promise<TaskModel> {
    const tasks = await this.getAll();
    const toDelete = tasks.find((t) => t.id === id);

    if (!toDelete) {
      throw new Error("Tarea no encontrada");
    }

    await this.saveAll(tasks.filter((t) => t.id !== id));
    return TaskModel.fromDTO(toDelete);
  }
}
