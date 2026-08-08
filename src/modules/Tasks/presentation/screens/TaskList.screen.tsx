import { FlatList, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BackgroundView } from "@/core/components/BackgroundView.component";
import { FilledIconButton } from "@/core/components/FilledIconButton";
import { useThemeContext } from "@/core/contexts/theme.context";
import { TaskCard } from "../components/TaskCard.component";
import { useTaskList } from "../hooks/useTaskList.hook";
import { useDeleteTask } from "../hooks/useDeleteTask.hook";

export const TaskListScreen = () => {
  const router = useRouter();
  const { palette } = useThemeContext();
  const { tasks, isLoading, isError, reload, toggleComplete } = useTaskList();
  const { confirmDelete } = useDeleteTask(reload);

  return (
    <BackgroundView style={{ paddingTop: 8 }}>
      <View style={[styles.header, { borderBottomColor: palette.colors.divider }]}>
        <View>
          <Text style={[styles.title, { color: palette.texts.primary }]}>Mis tareas</Text>
          <Text style={[styles.subtitle, { color: palette.texts.tertiary }]}>
            {tasks.length > 0 ? `${tasks.length} tarea${tasks.length === 1 ? "" : "s"}` : "Organiza tu día"}
          </Text>
        </View>
        <FilledIconButton icon={Ionicons} name="add" onPress={() => router.push("/tasks/new")} />
      </View>

      {isError && (
        <Text style={{ color: palette.texts.error }}>No se pudieron cargar las tareas.</Text>
      )}

      {!isLoading && tasks.length === 0 && !isError && (
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-done-outline" size={48} color={palette.texts.tertiary} />
          <Text style={[styles.emptyText, { color: palette.texts.secondary }]}>
            Aún no tienes tareas registradas. Toca "+" para crear la primera.
          </Text>
        </View>
      )}

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id!}
        refreshing={isLoading}
        onRefresh={reload}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TaskCard task={item} onToggle={toggleComplete} onDelete={confirmDelete} />
        )}
      />
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