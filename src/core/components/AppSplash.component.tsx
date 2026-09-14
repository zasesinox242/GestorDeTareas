import { FC, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "@/core/contexts/theme.context";

interface AppSplashProps {
  onFinish: () => void;
}

const TOTAL_DURATION_MS = 1100;

/**
 * Pantalla de bienvenida propia, mostrada justo después de ocultar el splash
 * nativo de Expo (que es una imagen estática en blanco). Se anima sola y
 * avisa con onFinish cuando ya puede desmontarse.
 */
export const AppSplash: FC<AppSplashProps> = ({ onFinish }) => {
  const { palette } = useThemeContext();
  const iconScale = useSharedValue(0.6);
  const iconOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    iconOpacity.value = withTiming(1, { duration: 280, easing: Easing.out(Easing.ease) });
    iconScale.value = withSequence(
      withTiming(1.08, { duration: 320, easing: Easing.out(Easing.back(1.6)) }),
      withTiming(1, { duration: 140 }),
    );
    textOpacity.value = withDelay(220, withTiming(1, { duration: 320 }));

    const timeout = setTimeout(onFinish, TOTAL_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [iconOpacity, iconScale, onFinish, textOpacity]);

  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));
  const textStyle = useAnimatedStyle(() => ({ opacity: textOpacity.value }));

  return (
    <Animated.View
      exiting={FadeOut.duration(300)}
      style={[styles.container, { backgroundColor: palette.colors.primary.default }]}
      pointerEvents="none"
    >
      <Animated.View style={[styles.iconCircle, iconStyle]}>
        <Ionicons name="checkmark-done" size={44} color={palette.colors.primary.default} />
      </Animated.View>
      <Animated.Text style={[styles.title, textStyle]}>Gestor de Tareas</Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    zIndex: 999,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { color: "#fff", fontSize: 20, fontWeight: "700", letterSpacing: 0.3 },
});
