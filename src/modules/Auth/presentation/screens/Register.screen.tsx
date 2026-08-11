import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";
import { BackgroundView } from "@/core/components/BackgroundView.component";
import { useThemeContext } from "@/core/contexts/theme.context";
import { RegisterForm } from "../components/RegisterForm.component";
import { useRegister } from "../hooks/useRegister.hook";
import { useGoogleSignIn } from "../hooks/useGoogleSignIn.hook";

export const RegisterScreen = () => {
  const { palette } = useThemeContext();
  const { form, dataStates, handleChange, handleRegister } = useRegister();
  const { isLoading: googleLoading, handleGoogleSignIn } = useGoogleSignIn();

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <Pressable
        style={{ flex: 1, backgroundColor: palette.colors.primary.light }}
        onPress={Platform.OS === "web" ? undefined : Keyboard.dismiss}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingTop: 70 }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        >
          <BackgroundView style={{ paddingTop: 40, paddingBottom: 40 }}>
            <RegisterForm
              nombre={form.nombre}
              email={form.email}
              password={form.password}
              onChangeNombre={(value) => handleChange("nombre", value)}
              onChangeEmail={(value) => handleChange("email", value)}
              onChangePassword={(value) => handleChange("password", value)}
              onSubmit={handleRegister}
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
