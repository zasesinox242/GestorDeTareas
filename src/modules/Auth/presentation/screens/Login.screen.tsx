import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
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
        {/* Formas decorativas: puro color, sin dependencias nuevas. */}
        <View style={styles.blobsLayer} pointerEvents="none">
          <View
            style={[
              styles.blob,
              { width: 260, height: 260, top: -90, right: -60, backgroundColor: palette.colors.primary.default },
            ]}
          />
          <View
            style={[
              styles.blob,
              { width: 180, height: 180, top: 40, left: -70, backgroundColor: "#ffffff", opacity: 0.18 },
            ]}
          />
        </View>

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

const styles = StyleSheet.create({
  blobsLayer: { ...StyleSheet.absoluteFillObject, overflow: "hidden" },
  blob: { position: "absolute", borderRadius: 999, opacity: 0.22 },
});
