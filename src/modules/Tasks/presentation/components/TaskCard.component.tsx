import { FC, useRef } from "react";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { IconButton } from "@/core/components/IconButton.component";
import { useThemeContext } from "@/core/contexts/theme.context";
import { TaskEntity, TaskPriority } from "../../domain/entities/task.entity";

const PRIORIDAD_LABEL: Record<TaskPriority, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
};

type DueStatus = "overdue" | "today" | "none";

const getDueStatus = (task: TaskEntity): DueStatus => {
  if (!task.fechaVencimiento || task.completada) return "none";

  const due = new Date(task.fechaVencimiento);
  if (Number.isNaN(due.getTime())) return "none";

  const now = new Date();
  if (due.getTime() < now.getTime()) return "overdue";

  const isSameDay =
    due.getFullYear() === now.getFullYear() &&
    due.getMonth() === now.getMonth() &&
    due.getDate() === now.getDate();

  return isSameDay ? "today" : "none";
};

const formatDueTime = (isoDate: string) =>
  new Date(isoDate).toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

interface TaskCardProps {
  task: TaskEntity;
  index?: number;
  onToggle: (task: TaskEntity) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: FC<TaskCardProps> = ({ task, index = 0, onToggle, onDelete }) => {
  const router = useRouter();
  const { palette } = useThemeContext();
  const swipeableRef = useRef<Swipeable>(null);
  const checkScale = useSharedValue(1);

  const priorityColor: Record<TaskPriority, string> = {
    baja: palette.colors.success,
    media: palette.colors.warning,
    alta: palette.colors.error,
  };

  const dueStatus = getDueStatus(task);
  const dueBorderColor =
    dueStatus === "overdue" ? palette.colors.error : dueStatus === "today" ? palette.colors.warning : "transparent";

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const handleToggle = () => {
    // Pequeño "bounce" al marcar/desmarcar, para que se sienta como una
    // confirmación en vez de un cambio instantáneo de icono.
    checkScale.value = withSequence(
      withTiming(0.75, { duration: 90 }),
      withTiming(1, { duration: 140 }),
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle(task);
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (task.id) onDelete(task.id);
  };

  const renderRightActions = () => (
    <View style={[styles.deleteAction, { backgroundColor: palette.colors.error }]}>
      <IconButton
        icon={Ionicons}
        name="trash-outline"
        onPress={() => {
          swipeableRef.current?.close();
          handleDelete();
        }}
      />
    </View>
  );

  return (
    <Animated.View
      // Entrada escalonada: cada tarjeta aparece un poco después que la anterior.
      entering={FadeInDown.delay(index * 60).springify().damping(16)}
      style={styles.wrapper}
    >
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        overshootRight={false}
        friction={2}
        rightThreshold={40}
      >
        <Pressable
          style={[
            styles.container,
            { backgroundColor: palette.colors.surface, borderLeftColor: dueBorderColor },
          ]}
          onPress={() => router.push(`/tasks/${task.id}`)}
        >
          <Animated.View style={checkAnimatedStyle}>
            <IconButton
              icon={Ionicons}
              name={task.completada ? "checkbox" : "square-outline"}
              color={task.completada ? "success" : "primary"}
              onPress={handleToggle}
            />
          </Animated.View>

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

            <View style={styles.metaRow}>
              <View
                style={[
                  styles.priorityChip,
                  { backgroundColor: `${priorityColor[task.prioridad]}26` },
                ]}
              >
                <Text style={[styles.priorityChipText, { color: priorityColor[task.prioridad] }]}>
                  {PRIORIDAD_LABEL[task.prioridad] ?? task.prioridad}
                </Text>
              </View>
            </View>

            {!!task.fechaVencimiento && (
              <View style={styles.metaRow}>
                <Ionicons
                  name="alarm-outline"
                  size={13}
                  color={dueStatus === "none" ? palette.texts.tertiary : dueBorderColor}
                />
                <Text
                  style={{
                    color: dueStatus === "none" ? palette.texts.tertiary : dueBorderColor,
                    fontSize: 13,
                    fontWeight: dueStatus === "none" ? "400" : "700",
                  }}
                >
                  {dueStatus === "overdue" && "Vencida — "}
                  {dueStatus === "today" && "Vence hoy — "}
                  {formatDueTime(task.fechaVencimiento)}
                </Text>
              </View>
            )}
          </View>
        </Pressable>
      </Swipeable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12 },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 16,
  },
  titulo: { fontSize: 16, fontWeight: "700" },
  completada: { textDecorationLine: "line-through", opacity: 0.6 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  priorityChip: {
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  priorityChipText: { fontSize: 12, fontWeight: "700" },
  deleteAction: {
    justifyContent: "center",
    alignItems: "center",
    width: 72,
    borderRadius: 12,
    marginLeft: 8,
  },
});
