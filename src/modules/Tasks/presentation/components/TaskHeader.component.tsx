import { FC } from "react";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IconButton } from "@/core/components/IconButton.component";
import { useThemeContext } from "@/core/contexts/theme.context";

interface TaskHeaderProps {
  title: string;
  showBack?: boolean;
}

export const TaskHeader: FC<TaskHeaderProps> = ({ title, showBack = true }) => {
  const router = useRouter();
  const { palette } = useThemeContext();

  return (
    <View style={styles.container}>
      {showBack && (
        <IconButton icon={Ionicons} name="arrow-back" onPress={() => router.back()} />
      )}
      <Text style={[styles.title, { color: palette.texts.primary }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 12 },
  title: { fontSize: 20, fontWeight: "700" },
});
