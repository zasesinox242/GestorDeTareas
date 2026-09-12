import { type SQLiteDatabase } from "expo-sqlite";

const DATABASE_VERSION = 3;

export const migrateDatabase = async (db: SQLiteDatabase): Promise<void> => {
  await db.execAsync("PRAGMA journal_mode = WAL;");

  const result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );
  const currentVersion = result?.user_version ?? 0;

  if (currentVersion >= DATABASE_VERSION) return;

  if (currentVersion === 0) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY NOT NULL,
        ownerId TEXT NOT NULL,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        completada INTEGER NOT NULL DEFAULT 0,
        prioridad TEXT NOT NULL,
        fecha TEXT NOT NULL,
        imagenUrl TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_tasks_ownerId
      ON tasks (ownerId);
    `);
  }

  if (currentVersion < 2) {
    // synced = 0 -> falta subir a Firestore. 1 -> ya está en la nube.
    await db.execAsync(`
      ALTER TABLE tasks ADD COLUMN synced INTEGER NOT NULL DEFAULT 0;

      CREATE TABLE IF NOT EXISTS pending_deletes (
        id TEXT PRIMARY KEY NOT NULL,
        ownerId TEXT NOT NULL
      );
    `);
  }

  if (currentVersion < 3) {
    // Fecha y hora límite de la tarea (nullable: no todas las tareas la tienen).
    // Se usa para el indicador de "vencida"/"vence hoy" y para programar
    // la notificación local de recordatorio.
    await db.execAsync(`
      ALTER TABLE tasks ADD COLUMN fechaVencimiento TEXT;
    `);
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION};`);
};