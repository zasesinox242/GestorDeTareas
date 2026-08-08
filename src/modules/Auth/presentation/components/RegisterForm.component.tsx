import { FC } from "react";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { CustomButton } from "@/core/components/CustomButton.component";
import { InputField } from "@/core/components/InputField.components";
import { useThemeContext } from "@/core/contexts/theme.context";

interface RegisterFormProps {
  nombre: string;
  email: string;
  password: string;
  onChangeNombre: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onSubmit: VoidFunction;
  loading?: boolean;
}

export const RegisterForm: FC<RegisterFormProps> = ({
  nombre,
  email,
  password,
  onChangeNombre,
  onChangeEmail,
  onChangePassword,
  onSubmit,
  loading,
}) => {
  const { palette } = useThemeContext();

  return (
    <View>
      <Text style={styles.title}>Crear cuenta</Text>
      <Text style={[styles.subtitle, { color: palette.texts.secondary }]}>
        Regístrate para gestionar tus tareas
      </Text>
      <View style={styles.inputGroup}>
        <InputField label="Nombre" placeholder="Ingresar nombre" value={nombre} onChangeText={onChangeNombre} />
        <InputField
          label="Correo"
          placeholder="Ingresar correo"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={onChangeEmail}
        />
        <InputField
          label="Contraseña"
          secureTextEntry
          placeholder="Ingresar contraseña"
          value={password}
          onChangeText={onChangePassword}
        />
      </View>
      <CustomButton title="Registrarse" onPress={onSubmit} disabled={loading} />
      <View style={styles.login}>
        <Text style={styles.loginText}>¿Ya tienes una cuenta?</Text>
        <Link href="/" style={[styles.link, { color: palette.texts.link }]}>
          Ingresar
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 16, marginBottom: 30 },
  inputGroup: { gap: 20, marginBottom: 40 },
  login: { marginTop: 30, flexDirection: "row", gap: 5, justifyContent: "center", alignItems: "center" },
  link: { fontSize: 16, textDecorationLine: "underline" },
  loginText: { fontWeight: "600" },
});
