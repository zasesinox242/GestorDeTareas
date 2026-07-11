// Claves de AsyncStorage centralizadas para evitar strings sueltos
// repetidos por toda la app (y typos entre ellos).
export const STORAGE_KEYS = {
  ACCOUNT: '@gestor_tareas:account',
  TASKS_PREFIX: '@gestor_tareas:tasks:',
  THEME: '@gestor_tareas:theme_mode',
} as const;

// Genera la clave de almacenamiento de tareas para un usuario en particular,
// así cada cuenta registrada guarda su propio listado de forma aislada.
export const buildTasksKey = (email: string): string =>
  `${STORAGE_KEYS.TASKS_PREFIX}${email.trim().toLowerCase()}`;
