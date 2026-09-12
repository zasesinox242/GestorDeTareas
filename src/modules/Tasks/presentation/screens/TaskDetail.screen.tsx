import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { BackgroundView } from "@/core/components/BackgroundView.component";
import { CustomButton } from "@/core/components/CustomButton.component";
import { useThemeContext } from "@/core/contexts/theme.context";
import { TaskHeader } from "../components/TaskHeader.component";
import { useTaskDetail } from "../hooks/useTaskDetail.hook";

const PRIORIDAD_LABEL: Record<string, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
};

const formatFecha = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;

  return date.toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const TaskDetailScreen = () => {
  const router = useRouter();
  const { palette } = useThemeContext();
  const { id, task, isLoading } = useTaskDetail();

  return (
    <BackgroundView>
      <TaskHeader title="Detalle de la tarea" />

      {isLoading && <ActivityIndicator />}

      {!isLoading && !task && (
        <Text style={{ color: palette.texts.secondary }}>No se encontró la tarea.</Text>
      )}

      {task && (
        <Animated.View
          entering={FadeInUp.springify().damping(16)}
          style={[styles.card, { backgroundColor: palette.colors.surface }]}
        >
          {!!task.imagenUrl && (
            <Image source={{ uri: task.imagenUrl }} style={styles.image} />
          )}
          <Row label="Título" value={task.titulo} palette={palette} />
          {!!task.descripcion && <Row label="Descripción" value={task.descripcion} palette={palette} />}
          <Row label="Prioridad" value={PRIORIDAD_LABEL[task.prioridad] ?? task.prioridad} palette={palette} />
          <Row label="Estado" value={task.completada ? "Completada" : "Pendiente"} palette={palette} />
          {!!task.fecha && <Row label="Fecha de creación" value={formatFecha(task.fecha)} palette={palette} />}
          {!!task.fechaVencimiento && (
            <Row label="Fecha límite" value={formatFecha(task.fechaVencimiento)} palette={palette} />
          )}

          <CustomButton
            title="Editar tarea"
            onPress={() => router.push(`/tasks/${id}/edit`)}
            style={{ marginTop: 20 }}
          />
        </Animated.View>
      )}
    </BackgroundView>
  );
};

const Row = ({ label, value, palette }: { label: string; value: string; palette: any }) => (
  <View style={styles.row}>
    <Text style={{ color: palette.texts.secondary }}>{label}</Text>
    <Text style={[styles.value, { color: palette.texts.primary }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: { borderRadius: 12, padding: 16, gap: 12 },
  image: { width: "100%", height: 220, borderRadius: 12 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  value: { fontWeight: "600" },
});