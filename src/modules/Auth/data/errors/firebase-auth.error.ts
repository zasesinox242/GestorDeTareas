import { FirebaseError } from "firebase/app";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/account-exists-with-different-credential":
    "Este correo ya está asociado a otro método de inicio de sesión",
  "auth/email-already-in-use": "Ya existe una cuenta con este correo",
  "auth/invalid-credential": "Correo o contraseña incorrectos",
  "auth/invalid-email": "Ingresa un correo válido",
  "auth/missing-password": "Ingresa una contraseña",
  "auth/network-request-failed": "No se pudo conectar. Revisa tu conexión a internet",
  "auth/operation-not-allowed":
    "Este método de inicio de sesión no está habilitado en Firebase",
  "auth/too-many-requests": "Demasiados intentos. Inténtalo nuevamente más tarde",
  "auth/user-disabled": "Esta cuenta fue deshabilitada",
  "auth/user-not-found": "Correo o contraseña incorrectos",
  "auth/weak-password": "La contraseña debe tener al menos 6 caracteres",
  "auth/wrong-password": "Correo o contraseña incorrectos",
};

export const mapFirebaseAuthError = (error: unknown, fallbackMessage: string): Error => {
  if (error instanceof FirebaseError) {
    return new Error(AUTH_ERROR_MESSAGES[error.code] ?? fallbackMessage);
  }

  return error instanceof Error ? error : new Error(fallbackMessage);
};
