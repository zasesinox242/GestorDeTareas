import { FC, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
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

const HOLD_MS = 750;
const FADE_OUT_MS = 300;

/**
 * Pantalla de bienvenida propia, mostrada justo después de ocultar el splash
 * nativo de Expo (que es una imagen estática en blanco).
 *
 * IMPORTANTE: el cierre se controla con un setTimeout normal de JS, NO con
 * la prop `exiting` de Reanimated. `exiting` depende de que el motor de
 * animaciones avise cuándo terminó, y en ciertos entornos (New Architecture
 * + algunas combinaciones nativas) ese aviso nunca llega y la vista se queda
 * congelada en pantalla para siempre. Un temporizador de JS siempre se
 * dispara, sin depender de nada del hilo nativo.
 */
export const AppSplash: FC<AppSplashProps> = ({ onFinish }) => {
  const { palette } = useThemeContext();
  const iconScale = useSharedValue(0.6);
  const iconOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    iconOpacity.value = withTiming(1, { duration: 280, easing: Easing.out(Easing.ease) });
    iconScale.value = withSequence(
      withTiming(1.08, { duration: 320, easing: Easing.out(Easing.back(1.6)) }),
      withTiming(1, { duration: 140 }),
    );
    textOpacity.value = withDelay(220, withTiming(1, { duration: 320 }));

    // Al llegar a HOLD_MS, se inicia el fade visual...
    const fadeTimer = setTimeout(() => {
      containerOpacity.value = withTiming(0, { duration: FADE_OUT_MS });
    }, HOLD_MS);

    // ...y este es el que de verdad saca el componente del árbol, sin
    // importar si la animación visual de arriba llegó a completarse.
    const removeTimer = setTimeout(onFinish, HOLD_MS + FADE_OUT_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [containerOpacity, iconOpacity, iconScale, onFinish, textOpacity]);

  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));
  const textStyle = useAnimatedStyle(() => ({ opacity: textOpacity.value }));
  const containerStyle = useAnimatedStyle(() => ({ opacity: containerOpacity.value }));

  return (
    <Animated.View
      style={[
        styles.container,
        containerStyle,
        { backgroundColor: palette.colors.primary.default },
      ]}
      pointerEvents="none"
    >
      <Animated.View style={[styles.iconCircle, iconStyle]}>
        <Ionicons name="checkmark-done" size={44} color={palette.colors.primary.default} />
      </Animated.View>
      <Animated.Text style={[styles.title, textStyle]}>TareaX</Animated.Text>
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
