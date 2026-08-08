import { Alert, StyleSheet, Switch, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { BackgroundView } from "@/core/components/BackgroundView.component";
import { CustomButton } from "@/core/components/CustomButton.component";
import { useThemeContext } from "@/core/contexts/theme.context";
import { useAuthContext } from "../contexts/auth.context";
import { logoutUseCase } from "../../di/auth.dependencies";

export const SettingsScreen = () => {
  const router = useRouter();
  const { palette, toggleTheme } = useThemeContext();
  const { user, setUser } = useAuthContext();
  const isDark = palette.schema === "dark";

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Seguro que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          await logoutUseCase.execute();
          setUser(null);
          router.replace("/");
        },
      },
    ]);
  };

  return (
    <BackgroundView style={{ gap: 20 }}>
      <Text style={[styles.title, { color: palette.texts.primary }]}>Perfil</Text>

      <View style={[styles.card, { backgroundColor: palette.colors.surface }]}>
        <Text style={{ color: palette.texts.secondary }}>Correo</Text>
        <Text style={[styles.value, { color: palette.texts.primary }]}>{user?.email}</Text>
        {!!user?.nombre && (
          <>
            <Text style={{ color: palette.texts.secondary, marginTop: 12 }}>Nombre</Text>
            <Text style={[styles.value, { color: palette.texts.primary }]}>{user.nombre}</Text>
          </>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: palette.colors.surface }]}>
        <Text style={[styles.section, { color: palette.texts.primary }]}>Apariencia</Text>
        <View style={styles.row}>
          <Text style={{ color: palette.texts.primary }}>Modo oscuro</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: palette.colors.border, true: palette.colors.primary.default }}
            thumbColor={palette.colors.surface}
          />
        </View>
      </View>

      <CustomButton title="Cerrar sesión" color="error" onPress={handleLogout} />
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "bold" },
  card: { borderRadius: 12, padding: 16 },
  value: { fontSize: 16, fontWeight: "600" },
  section: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});