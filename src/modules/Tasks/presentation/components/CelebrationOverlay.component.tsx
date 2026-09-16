import { FC, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useThemeContext } from "@/core/contexts/theme.context";

interface CelebrationOverlayProps {
  onFinish: () => void;
}

const HOLD_MS = 1200;
const FADE_OUT_MS = 250;

/**
 * Se muestra brevemente cuando se completan TODAS las tareas de la lista.
 * El cierre se controla con setTimeout, no con la prop `exiting` de
 * Reanimated (ver nota en AppSplash.component.tsx sobre por qué).
 */
export const CelebrationOverlay: FC<CelebrationOverlayProps> = ({ onFinish }) => {
  const { palette } = useThemeContext();
  const scale = useSharedValue(0.4);
  const opacity = useSharedValue(0);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    opacity.value = withTiming(1, { duration: 200 });
    scale.value = withSequence(
      withTiming(1.1, { duration: 300, easing: Easing.out(Easing.back(2)) }),
      withTiming(1, { duration: 150 }),
    );

    const fadeTimer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: FADE_OUT_MS });
    }, HOLD_MS);

    const removeTimer = setTimeout(onFinish, HOLD_MS + FADE_OUT_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onFinish, opacity, scale]);

  const badgeStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Animated.View
        style={[styles.badge, badgeStyle, { backgroundColor: palette.colors.success }]}
      >
        <Ionicons name="checkmark-circle" size={40} color="#fff" />
        <Text style={styles.text}>¡Todo listo! 🎉</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 998,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  text: { color: "#fff", fontSize: 17, fontWeight: "700" },
});
