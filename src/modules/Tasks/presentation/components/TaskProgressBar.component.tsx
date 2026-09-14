import { FC, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useThemeContext } from "@/core/contexts/theme.context";

interface TaskProgressBarProps {
  total: number;
  completed: number;
}

export const TaskProgressBar: FC<TaskProgressBarProps> = ({ total, completed }) => {
  const { palette } = useThemeContext();
  const progress = useSharedValue(0);
  const ratio = total > 0 ? completed / total : 0;

  useEffect(() => {
    progress.value = withTiming(ratio, { duration: 450 });
  }, [progress, ratio]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  if (total === 0) return null;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.track, { backgroundColor: palette.colors.border }]}>
        <Animated.View
          style={[styles.fill, fillStyle, { backgroundColor: palette.colors.success }]}
        />
      </View>
      <Text style={[styles.label, { color: palette.texts.tertiary }]}>
        {completed} de {total} completadas
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12, gap: 6 },
  track: { height: 8, borderRadius: 4, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 4 },
  label: { fontSize: 12, alignSelf: "flex-end" },
});
