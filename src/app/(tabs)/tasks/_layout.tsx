import { Stack } from "expo-router";

export default function TasksStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="new" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="[id]/index" options={{ animation: "fade_from_bottom", animationDuration: 220 }} />
      <Stack.Screen name="[id]/edit" options={{ animation: "slide_from_bottom" }} />
    </Stack>
  );
}
