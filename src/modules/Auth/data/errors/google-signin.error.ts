const GOOGLE_ERROR_MESSAGES: Record<string, string> = {
  DEVELOPER_ERROR:
    "Google no está configurado correctamente. Revisa el package, SHA y Client ID",
  IN_PROGRESS: "Ya hay un inicio de sesión con Google en curso",
  ONE_TAP_START_FAILED: "No se pudo abrir el acceso con Google",
  PLAY_SERVICES_NOT_AVAILABLE:
    "Google Play Services no está disponible o necesita actualizarse",
  SIGN_IN_REQUIRED: "Selecciona una cuenta de Google para continuar",
};

export const isGoogleCancellationError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  error.code === "SIGN_IN_CANCELLED";

export const mapGoogleSignInError = (error: unknown): Error => {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = String(error.code);
    const message = GOOGLE_ERROR_MESSAGES[code];
    if (message) return new Error(message);
  }

  return error instanceof Error
    ? error
    : new Error("No se pudo iniciar sesión con Google");
};
