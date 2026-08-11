import { Stack } from "expo-router";
import { ThemeProvider } from "@/core/contexts/theme.context";
import { AuthProvider } from "@/modules/Auth/presentation/contexts/auth.context";
import { TaskDependenciesProvider } from "@/modules/Tasks/presentation/contexts/task-dependencies.context";
import { migrateDatabase } from "@/config/database/migrations";
import { SQLiteProvider } from "expo-sqlite";

export default function RootLayout() {
  return (
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
  );
}
