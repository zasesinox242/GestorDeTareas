import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { firestoreDb } from "@/config/firebase";
import { TaskModel } from "../../models/task.model";

export interface TaskRemoteDataSource {
  pushTask: (task: TaskModel, ownerId: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export class TaskFirestoreDataSourceImpl implements TaskRemoteDataSource {
  private readonly collectionName = "tasks";

  async pushTask(task: TaskModel, ownerId: string): Promise<void> {
    if (!task.id) throw new Error("La tarea necesita un id local antes de sincronizar");

    // Usamos el MISMO id que en SQLite como id del documento en Firestore.
    // Esto hace la escritura idempotente: reenviar la misma tarea nunca duplica.
    const ref = doc(firestoreDb, this.collectionName, task.id);
    await setDoc(
      ref,
      {
        ownerId,
        titulo: task.titulo,
        descripcion: task.descripcion ?? null,
        completada: task.completada,
        prioridad: task.prioridad,
        fecha: task.fecha,
        fechaVencimiento: task.fechaVencimiento ?? null,
        imagenUrl: task.imagenUrl ?? null,
      },
      { merge: true },
    );
  }

  async deleteTask(id: string): Promise<void> {
    await deleteDoc(doc(firestoreDb, this.collectionName, id));
  }
}