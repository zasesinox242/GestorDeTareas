import { Stack } from "expo-router";
import { ThemeProvider } from "@/core/contexts/theme.context";
import { AuthProvider } from "@/modules/Auth/presentation/contexts/auth.context";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="register" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}
