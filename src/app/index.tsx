import { Redirect } from "expo-router";
import { LoginScreen } from "@/modules/Auth/presentation/screens/Login.screen";
import { useAuthContext } from "@/modules/Auth/presentation/contexts/auth.context";
// TODO: cuando migremos a Firebase, este chequeo pasará a usar
//   auth.currentUser (como en profesor/index.tsx) en vez del AuthContext local.

export default function Index() {
  const { user, isLoading } = useAuthContext();

  if (isLoading) return null;

  return user ? <Redirect href="/tasks" /> : <LoginScreen />;
}
