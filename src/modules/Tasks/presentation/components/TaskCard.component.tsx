import { FC } from "react";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IconButton } from "@/core/components/IconButton.component";
import { useThemeContext } from "@/core/contexts/theme.context";
import { TaskEntity } from "../../domain/entities/task.entity";

const PRIORIDAD_LABEL: Record<string, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
};

interface TaskCardProps {
  task: TaskEntity;
  onToggle: (task: TaskEntity) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: FC<TaskCardProps> = ({ task, onToggle, onDelete }) => {
  const router = useRouter();
  const { palette } = useThemeContext();

  return (
    <Pressable
      onPress={() => router.push(`/tasks/${task.id}`)}
      style={[styles.container, { backgroundColor: palette.colors.surface }]}
    >
      <IconButton
        icon={Ionicons}
        name={task.completada ? "checkbox" : "square-outline"}
        color={task.completada ? "success" : "primary"}
        onPress={() => onToggle(task)}
      />

      <View style={{ flex: 1, marginLeft: 8 }}>
        <Text
          style={[
            styles.titulo,
            { color: palette.texts.primary },
            task.completada && styles.completada,
          ]}
        >
          {task.titulo}
        </Text>
        <Text style={{ color: palette.texts.tertiary }}>
          Prioridad: {PRIORIDAD_LABEL[task.prioridad] ?? task.prioridad}
        </Text>
      </View>

      <IconButton
        icon={Ionicons}
        name="trash-outline"
        color="error"
        onPress={() => task.id && onDelete(task.id)}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  titulo: { fontSize: 16, fontWeight: "700" },
  completada: { textDecorationLine: "line-through", opacity: 0.6 },
});
