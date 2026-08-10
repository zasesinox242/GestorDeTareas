import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseError } from "firebase/app";
import * as FirebaseAuth from "firebase/auth";
import type { Auth, Persistence } from "firebase/auth";
import { firebaseApp } from "./app";

type ReactNativePersistenceFactory = (
  storage: typeof AsyncStorage,
) => Persistence;

// Firebase incluye esta función en su entrada React Native, pero la declaración
// del paquete raíz no la expone a TypeScript en todas las resoluciones.
const getReactNativePersistence = (
  FirebaseAuth as typeof FirebaseAuth & {
    getReactNativePersistence: ReactNativePersistenceFactory;
  }
).getReactNativePersistence;

const initializeNativeAuth = (): Auth => {
  try {
    return FirebaseAuth.initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    // Fast Refresh puede volver a evaluar este módulo con Auth ya inicializado.
    if (error instanceof FirebaseError && error.code === "auth/already-initialized") {
      return FirebaseAuth.getAuth(firebaseApp);
    }
    throw error;
  }
};

export const auth = initializeNativeAuth();
