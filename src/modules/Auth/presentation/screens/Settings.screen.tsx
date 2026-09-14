import { Image, StyleSheet, Switch, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { BackgroundView } from "@/core/components/BackgroundView.component";
import { CustomButton } from "@/core/components/CustomButton.component";
import { useThemeContext } from "@/core/contexts/theme.context";
import { useToast } from "@/core/contexts/toast.context";
import { useConfirm } from "@/core/contexts/confirm.context";
import { useAuthContext } from "../contexts/auth.context";
import { logoutUseCase } from "../../di/auth.dependencies";

export const SettingsScreen = () => {
  const router = useRouter();
  const { palette, toggleTheme } = useThemeContext();
  const { user, setUser } = useAuthContext();
  const { showToast } = useToast();
  const confirm = useConfirm();
  const isDark = palette.schema === "dark";
  const profileInitial = (user?.nombre || user?.email || "U").charAt(0).toUpperCase();
  const providerLabel = user?.proveedor === "google" ? "Google" : "Correo y contraseña";

  const logout = async () => {
    try {
      await logoutUseCase.execute();
      setUser(null);
      router.replace("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo cerrar sesión";
      showToast(message, "error");
    }
  };

  const handleLogout = async () => {
    const confirmed = await confirm({
      title: "Cerrar sesión",
      message: "¿Seguro que deseas cerrar sesión?",
      confirmText: "Cerrar sesión",
      destructive: true,
    });
    if (confirmed) await logout();
  };

  return (
    <BackgroundView style={{ gap: 20 }}>
      <Text style={[styles.title, { color: palette.texts.primary }]}>Perfil</Text>

      <View style={[styles.card, { backgroundColor: palette.colors.surface }]}>
        <View style={styles.profileHeader}>
          {user?.fotoUrl ? (
            <Image source={{ uri: user.fotoUrl }} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.avatarFallback,
                { backgroundColor: palette.colors.primary.default },
              ]}
            >
              <Text style={[styles.avatarText, { color: palette.colors.surface }]}>
                {profileInitial}
              </Text>
            </View>
          )}
          <View style={styles.profileSummary}>
            <Text style={[styles.profileName, { color: palette.texts.primary }]}>
              {user?.nombre || "Usuario"}
            </Text>
            <Text style={{ color: palette.texts.secondary }}>{providerLabel}</Text>
          </View>
        </View>

        <Text style={{ color: palette.texts.secondary }}>Correo</Text>
        <Text style={[styles.value, { color: palette.texts.primary }]}>{user?.email}</Text>
        {!!user?.nombre && (
          <>
            <Text style={{ color: palette.texts.secondary, marginTop: 12 }}>Nombre</Text>
            <Text style={[styles.value, { color: palette.texts.primary }]}>{user.nombre}</Text>
          </>
        )}
        <Text style={{ color: palette.texts.secondary, marginTop: 12 }}>Método de acceso</Text>
        <Text style={[styles.value, { color: palette.texts.primary }]}>{providerLabel}</Text>
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
  profileHeader: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 20 },
  profileSummary: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: "700", marginBottom: 2 },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  avatarFallback: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 24, fontWeight: "800" },
  value: { fontSize: 16, fontWeight: "600" },
  section: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});
