import { Keyboard, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { BackgroundView } from "@/core/components/BackgroundView.component";
import { useThemeContext } from "@/core/contexts/theme.context";
import { RegisterForm } from "../components/RegisterForm.component";
import { useRegister } from "../hooks/useRegister.hook";

export const RegisterScreen = () => {
  const { palette } = useThemeContext();
  const { form, dataStates, handleChange, handleRegister } = useRegister();

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <Pressable
        style={{ flex: 1, backgroundColor: palette.colors.primary.light, paddingTop: 100 }}
        onPress={Keyboard.dismiss}
      >
        <BackgroundView style={{ paddingTop: 50 }}>
          <RegisterForm
            nombre={form.nombre}
            email={form.email}
            password={form.password}
            onChangeNombre={(value) => handleChange("nombre", value)}
            onChangeEmail={(value) => handleChange("email", value)}
            onChangePassword={(value) => handleChange("password", value)}
            onSubmit={handleRegister}
            loading={dataStates.isLoading}
          />
        </BackgroundView>
      </Pressable>
    </KeyboardAvoidingView>
  );
};
