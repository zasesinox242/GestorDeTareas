import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "@/core/contexts/theme.context";
import { ToastProvider } from "@/core/contexts/toast.context";
import { ConfirmProvider } from "@/core/contexts/confirm.context";
import { AppSplash } from "@/core/components/AppSplash.component";
import { AuthProvider } from "@/modules/Auth/presentation/contexts/auth.context";
import { TaskDependenciesProvider } from "@/modules/Tasks/presentation/contexts/task-dependencies.context";
import { migrateDatabase } from "@/config/database/migrations";
import { configureTaskNotifications } from "@/core/services/taskNotifications.service";
import { SQLiteProvider } from "expo-sqlite";

// Evita que el splash nativo (imagen estática) se oculte solo; lo ocultamos
// nosotros apenas montamos, para pasar de inmediato a nuestro AppSplash animado.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    configureTaskNotifications();
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SQLiteProvider databaseName="tasks.db" onInit={migrateDatabase}>
        <ThemeProvider>
          <ToastProvider>
            <ConfirmProvider>
              <AuthProvider>
                <TaskDependenciesProvider>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="register" />
                    <Stack.Screen name="(tabs)" />
                  </Stack>
                  {showIntro && <AppSplash onFinish={() => setShowIntro(false)} />}
                </TaskDependenciesProvider>
              </AuthProvider>
            </ConfirmProvider>
          </ToastProvider>
        </ThemeProvider>
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}
