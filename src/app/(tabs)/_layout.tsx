import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "@/core/contexts/theme.context";

export default function TabsLayout() {
  const { palette } = useThemeContext();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: palette.colors.primary.dark,
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
