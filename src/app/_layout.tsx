import { Stack } from "expo-router";
import { ThemeProvider } from "@/core/contexts/theme.context";
import { AuthProvider } from "@/modules/Auth/presentation/contexts/auth.context";
// TODO: cuando integremos Firebase, aquí entrará algo como
//   import { auth } from "@/config/firebase";
// y/o un <SQLiteProvider> (como en el repo de profesor, rama feature/integration-firebase).
// Por ahora la autenticación y las tareas se guardan localmente (AsyncStorage).

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
