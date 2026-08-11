import { Redirect } from "expo-router";
import { LoginScreen } from "@/modules/Auth/presentation/screens/Login.screen";
import { useAuthContext } from "@/modules/Auth/presentation/contexts/auth.context";

export default function Index() {
  const { user, isLoading } = useAuthContext();

  if (isLoading) return null;

  return user ? <Redirect href="/tasks" /> : <LoginScreen />;
}
