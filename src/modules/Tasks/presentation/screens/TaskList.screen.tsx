import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { BackgroundView } from "@/core/components/BackgroundView.component";
import { FilledIconButton } from "@/core/components/FilledIconButton";
import { useThemeContext } from "@/core/contexts/theme.context";
import { TaskCard } from "../components/TaskCard.component";
import { TaskListSkeleton } from "../components/TaskCardSkeleton.component";
import { TaskProgressBar } from "../components/TaskProgressBar.component";
import { CelebrationOverlay } from "../components/CelebrationOverlay.component";
import { useTaskList } from "../hooks/useTaskList.hook";
import { useDeleteTask } from "../hooks/useDeleteTask.hook";

export const TaskListScreen = () => {
  const router = useRouter();
  const { palette } = useThemeContext();
  const { tasks, isLoading, isError, reload, toggleComplete, showCelebration, dismissCelebration } =
    useTaskList();
  const { confirmDelete } = useDeleteTask(reload);
  const completedCount = tasks.filter((t) => t.completada).length;

  // Solo mostramos el skeleton en la carga inicial (lista vacía). En un
  // pull-to-refresh posterior, la lista ya tiene datos y el spinner del
  // RefreshControl es suficiente feedback.
  const isFirstLoad = isLoading && tasks.length === 0;

  const handleAddTask = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/tasks/new");
  };

  const handleRefresh = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    reload();
  };

  return (
    <BackgroundView style={{ paddingTop: 8 }}>
      <View style={[styles.header, { borderBottomColor: palette.colors.divider }]}>
        <View>
          <Text style={[styles.title, { color: palette.texts.primary }]}>Mis tareas</Text>
          <Text style={[styles.subtitle, { color: palette.texts.tertiary }]}>
            {tasks.length > 0 ? `${tasks.length} tarea${tasks.length === 1 ? "" : "s"}` : "Organiza tu día"}
          </Text>
        </View>
        <FilledIconButton icon={Ionicons} name="add" onPress={handleAddTask} />
      </View>

      {isError && (
        <Text style={{ color: palette.texts.error }}>No se pudieron cargar las tareas.</Text>
      )}

      {!isFirstLoad && tasks.length > 0 && (
        <TaskProgressBar total={tasks.length} completed={completedCount} />
      )}

      {isFirstLoad && <TaskListSkeleton />}

      {!isFirstLoad && !isLoading && tasks.length === 0 && !isError && (
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-done-outline" size={48} color={palette.texts.tertiary} />
          <Text style={[styles.emptyText, { color: palette.texts.secondary }]}>
            Aún no tienes tareas registradas. Toca "+" para crear la primera.
          </Text>
        </View>
      )}

      {!isFirstLoad && (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id!}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              tintColor={palette.colors.primary.default}
              colors={[palette.colors.primary.default]}
            />
          }
          renderItem={({ item, index }) => (
            <TaskCard task={item} index={index} onToggle={toggleComplete} onDelete={confirmDelete} />
          )}
        />
      )}

      {showCelebration && <CelebrationOverlay onFinish={dismissCelebration} />}
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    marginBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: { fontSize: 26, fontWeight: "bold" },
  subtitle: { fontSize: 13, marginTop: 2 },
  list: { paddingBottom: 24 },
  emptyState: { alignItems: "center", gap: 12, marginTop: 48 },
  emptyText: { fontSize: 15, textAlign: "center", paddingHorizontal: 24 },
});