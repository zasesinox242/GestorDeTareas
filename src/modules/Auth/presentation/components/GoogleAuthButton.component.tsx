import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useThemeContext } from "@/core/contexts/theme.context";

type GoogleAuthButtonProps = {
  onPress: VoidFunction;
  loading?: boolean;
  disabled?: boolean;
};

export const GoogleAuthButton = ({
  onPress,
  loading = false,
  disabled = false,
}: GoogleAuthButtonProps) => {
  const { palette } = useThemeContext();
  const isDisabled = disabled || loading;

  return (
    <View style={styles.container}>
      <View style={styles.dividerRow}>
        <View style={[styles.divider, { backgroundColor: palette.colors.divider }]} />
        <Text style={[styles.dividerText, { color: palette.texts.secondary }]}>o</Text>
        <View style={[styles.divider, { backgroundColor: palette.colors.divider }]} />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Continuar con Google"
        disabled={isDisabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          {
            borderColor: palette.colors.border,
            backgroundColor: palette.colors.surface,
            opacity: isDisabled ? 0.55 : pressed ? 0.75 : 1,
          },
        ]}
      >
        <Ionicons name="logo-google" size={20} color={palette.texts.primary} />
        <Text style={[styles.buttonText, { color: palette.texts.primary }]}>
          {loading ? "Conectando..." : "Continuar con Google"}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 16, marginTop: 20 },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  divider: { flex: 1, height: 1 },
  dividerText: { fontSize: 14 },
  button: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 16,
  },
  buttonText: { fontSize: 16, fontWeight: "700" },
});
