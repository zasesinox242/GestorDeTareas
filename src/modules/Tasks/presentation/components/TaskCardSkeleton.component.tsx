import { FC, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useThemeContext } from "@/core/contexts/theme.context";

const SkeletonBlock: FC<{ width: number | `${number}%`; height: number }> = ({ width, height }) => {
  const { palette } = useThemeContext();
  return (
    <View
      style={{
        width,
        height,
        borderRadius: 6,
        backgroundColor: palette.colors.border,
      }}
    />
  );
};

/** Una tarjeta "fantasma" con la misma silueta que TaskCard, con un shimmer suave. */
const TaskCardSkeleton: FC = () => {
  const { palette } = useThemeContext();
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: palette.colors.surface }, animatedStyle]}
    >
      <View style={[styles.checkbox, { backgroundColor: palette.colors.border }]} />
      <View style={{ flex: 1, marginLeft: 8, gap: 8 }}>
        <SkeletonBlock width="70%" height={16} />
        <SkeletonBlock width="40%" height={12} />
      </View>
    </Animated.View>
  );
};

/** Lista de varias tarjetas fantasma, para mostrar durante la primera carga. */
export const TaskListSkeleton: FC<{ count?: number }> = ({ count = 5 }) => (
  <View>
    {Array.from({ length: count }).map((_, index) => (
      <TaskCardSkeleton key={index} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "transparent",
    padding: 16,
    marginBottom: 12,
  },
  checkbox: { width: 24, height: 24, borderRadius: 6 },
});
