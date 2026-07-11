// Tipos de rutas centralizados para tener autocompletado y chequeo de tipos
// al navegar (navigation.navigate(...), route.params, etc).

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  CreateTask: undefined;
  EditTask: { taskId: string };
  ChangePassword: undefined;
};

// Los nombres deben coincidir con TabKey en BottomNavBar.component.tsx
export type MainTabsParamList = {
  tareas: undefined;
  ajustes: undefined;
};
