import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/config/firebase";

/**
 * Selecciona una imagen de la galería y la sube a Firebase Storage bajo
 * `tasks/{ownerId}/{taskId}.jpg`, respetando la regla de seguridad que
 * limita cada carpeta al dueño (`ownerId`) autenticado.
 *
 * Requiere que la tarea ya exista (tenga `taskId`), por eso se usa después
 * de crear/guardar la tarea, tanto en NewTask.screen.tsx como en
 * EditTask.screen.tsx.
 */
export const useTaskImage = (ownerId: string) => {
  const pickAndUpload = async (taskId: string): Promise<string | null> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return null;

    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.6 });
    if (result.canceled) return null;

    const response = await fetch(result.assets[0].uri);
    const blob = await response.blob();

    const storageRef = ref(storage, `tasks/${ownerId}/${taskId}.jpg`);
    await uploadBytes(storageRef, blob);

    return getDownloadURL(storageRef);
  };

  return { pickAndUpload };
};
