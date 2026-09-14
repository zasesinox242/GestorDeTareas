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
import * as Haptics from "expo-haptics";
import { useThemeContext } from "@/core/contexts/theme.context";

interface CelebrationOverlayProps {
  onFinish: () => void;
}

const VISIBLE_MS = 1500;

/** Se muestra brevemente cuando se completan TODAS las tareas de la lista. */
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

    const timeout = setTimeout(onFinish, VISIBLE_MS);
    return () => clearTimeout(timeout);
  }, [onFinish, opacity, scale]);

  const badgeStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      exiting={FadeOut.duration(250)}
      style={styles.overlay}
      pointerEvents="none"
    >
      <Animated.View
        style={[styles.badge, badgeStyle, { backgroundColor: palette.colors.success }]}
      >
        <Ionicons name="checkmark-circle" size={40} color="#fff" />
        <Text style={styles.text}>¡Todo listo! 🎉</Text>
      </Animated.View>
    </Animated.View>
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
