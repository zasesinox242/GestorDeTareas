import { Redirect, Tabs } from "expo-router";
import { useTaskSync } from "@/modules/Tasks/presentation/hooks/useTaskSync.hook";
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "@/core/contexts/theme.context";
import { useAuthContext } from "@/modules/Auth/presentation/contexts/auth.context";

export default function TabsLayout() {
  const { palette } = useThemeContext();
  const { user, isLoading } = useAuthContext();

  // El hook debe llamarse siempre, en el mismo orden, sin importar el estado
  // de auth (Rules of Hooks). El propio hook decide internamente si sincroniza.
  useTaskSync();

  if (isLoading) return null;
  if (!user) return <Redirect href="/" />;
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: palette.colors.primary.dark,
        tabBarInactiveTintColor: palette.texts.tertiary,
        tabBarStyle: {
          backgroundColor: palette.colors.surface,
          borderTopColor: palette.colors.divider,
        },
      }}
    >
      <Tabs.Screen
        name="tasks"
        options={{
          headerShown: false,
          title: "Tareas",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          title: "Ajustes",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
