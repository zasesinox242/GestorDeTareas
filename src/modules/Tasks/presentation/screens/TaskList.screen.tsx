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
    <BackgroundView style={{ paddingTop: 20 }}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: palette.texts.primary }]}>Mis tareas</Text>
        <FilledIconButton icon={Ionicons} name="add" onPress={() => router.push("/tasks/new")} />
      </View>

      {isError && (
        <Text style={{ color: palette.texts.error }}>No se pudieron cargar las tareas.</Text>
      )}

      {!isLoading && tasks.length === 0 && !isError && (
        <Text style={{ color: palette.texts.secondary }}>
          Aún no tienes tareas registradas. Toca "+" para crear la primera.
        </Text>
      )}

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id!}
        refreshing={isLoading}
        onRefresh={reload}
        renderItem={({ item }) => (
          <TaskCard task={item} onToggle={toggleComplete} onDelete={confirmDelete} />
        )}
      />
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 26, fontWeight: "bold" },
});
