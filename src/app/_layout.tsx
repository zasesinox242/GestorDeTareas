import { useEffect } from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "@/core/contexts/theme.context";
import { AuthProvider } from "@/modules/Auth/presentation/contexts/auth.context";
import { TaskDependenciesProvider } from "@/modules/Tasks/presentation/contexts/task-dependencies.context";
import { migrateDatabase } from "@/config/database/migrations";
import { configureTaskNotifications } from "@/core/services/taskNotifications.service";
import { SQLiteProvider } from "expo-sqlite";

export default function RootLayout() {
  useEffect(() => {
    configureTaskNotifications();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SQLiteProvider databaseName="tasks.db" onInit={migrateDatabase}>
        <ThemeProvider>
          <AuthProvider>
            <TaskDependenciesProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="register" />
                <Stack.Screen name="(tabs)" />
              </Stack>
            </TaskDependenciesProvider>
          </AuthProvider>
        </ThemeProvider>
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}
