import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { TaskEntity } from "@/modules/Tasks/domain/entities/task.entity";

const ANDROID_CHANNEL_ID = "task-reminders";

// Cómo se comporta una notificación mientras la app está abierta en primer plano.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/** Debe llamarse una sola vez, al iniciar la app (ver RootLayout). */
export const configureTaskNotifications = async (): Promise<void> => {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
      name: "Recordatorios de tareas",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
};

/**
 * Programa (o reemplaza) el recordatorio de una tarea.
 * Usamos el ID de la tarea como identificador de la notificación:
 * así siempre podemos encontrarla y cancelarla sin guardar nada extra en la BD.
 */
export const scheduleTaskDueNotification = async (task: TaskEntity): Promise<void> => {
  if (!task.id) return;

  // Siempre se cancela la anterior primero: evita recordatorios duplicados
  // si el usuario cambia la fecha límite varias veces.
  await cancelTaskDueNotification(task.id);

  if (!task.fechaVencimiento || task.completada) return;

  const dueDate = new Date(task.fechaVencimiento);
  if (Number.isNaN(dueDate.getTime()) || dueDate.getTime() <= Date.now()) return;

  const granted = await requestNotificationPermission();
  if (!granted) return;

  await Notifications.scheduleNotificationAsync({
    identifier: task.id,
    content: {
      title: "Tarea por vencer",
      body: task.titulo,
      ...(Platform.OS === "android" ? { channelId: ANDROID_CHANNEL_ID } : {}),
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: dueDate },
  });
};

export const cancelTaskDueNotification = async (taskId: string): Promise<void> => {
  await Notifications.cancelScheduledNotificationAsync(taskId).catch(() => {
    // Si no existía ninguna notificación programada con ese id, no hay nada que hacer.
  });
};
