import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";
import { BackgroundView } from "@/core/components/BackgroundView.component";
import { useThemeContext } from "@/core/contexts/theme.context";
import { LoginForm } from "../components/LoginForm.component";
import { useLogin } from "../hooks/useLogin.hook";
import { useGoogleSignIn } from "../hooks/useGoogleSignIn.hook";

export const LoginScreen = () => {
  const { palette } = useThemeContext();
  const { credentials, dataStates, handleChange, handleLogin } = useLogin();
  const { isLoading: googleLoading, handleGoogleSignIn } = useGoogleSignIn();

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <Pressable
        style={{ flex: 1, backgroundColor: palette.colors.primary.light }}
        onPress={Platform.OS === "web" ? undefined : Keyboard.dismiss}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingTop: 120 }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        >
          <BackgroundView style={{ paddingTop: 50, paddingBottom: 40 }}>
            <LoginForm
              email={credentials.email}
              password={credentials.password}
              onChangeEmail={(value) => handleChange("email", value)}
              onChangePassword={(value) => handleChange("password", value)}
              onSubmit={handleLogin}
              onGoogleSubmit={handleGoogleSignIn}
              loading={dataStates.isLoading || googleLoading}
              googleLoading={googleLoading}
            />
          </BackgroundView>
        </ScrollView>
      </Pressable>
    </KeyboardAvoidingView>
  );
};
