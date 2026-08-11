import { Redirect } from "expo-router";
import { RegisterScreen } from "@/modules/Auth/presentation/screens/Register.screen";
import { useAuthContext } from "@/modules/Auth/presentation/contexts/auth.context";

export default function Register() {
  const { user, isLoading } = useAuthContext();

  if (isLoading) return null;

  return user ? <Redirect href="/tasks" /> : <RegisterScreen />;
}
