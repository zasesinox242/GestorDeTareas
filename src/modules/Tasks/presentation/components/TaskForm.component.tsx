import { FC } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { CustomButton } from "@/core/components/CustomButton.component";
import { InputField } from "@/core/components/InputField.components";
import { useThemeContext } from "@/core/contexts/theme.context";
import { TaskEntity, TaskPriority } from "../../domain/entities/task.entity";

const PRIORIDADES: { value: TaskPriority; label: string }[] = [
  { value: "baja", label: "Baja" },
  { value: "media", label: "Media" },
  { value: "alta", label: "Alta" },
];

interface TaskFormProps {
  task: TaskEntity;
  onChange: <K extends keyof TaskEntity>(field: K, value: TaskEntity[K]) => void;
  onSubmit: VoidFunction;
  loading?: boolean;
  submitLabel?: string;
}

export const TaskForm: FC<TaskFormProps> = ({ task, onChange, onSubmit, loading, submitLabel = "Guardar" }) => {
  const { palette } = useThemeContext();

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <InputField
        label="Título"
        placeholder="Título de la tarea"
        value={task.titulo}
        onChangeText={(value) => onChange("titulo", value)}
      />

      <InputField
        label="Descripción"
        placeholder="Detalles (opcional)"
        multiline
        value={task.descripcion}
        onChangeText={(value) => onChange("descripcion", value)}
      />

      <Text style={[styles.label, { color: palette.texts.primary }]}>Prioridad</Text>
      <View style={styles.prioridadRow}>
        {PRIORIDADES.map((prioridad) => (
          <CustomButton
            key={prioridad.value}
            title={prioridad.label}
            variant={task.prioridad === prioridad.value ? "filled" : "outlined"}
            onPress={() => onChange("prioridad", prioridad.value)}
            style={styles.prioridadItem}
          />
        ))}
      </View>

      <CustomButton title={submitLabel} onPress={onSubmit} disabled={loading} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: { gap: 16, paddingBottom: 40 },
  label: { fontSize: 16, fontWeight: "500" },
  prioridadRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  prioridadItem: { paddingHorizontal: 12, paddingVertical: 10 },
});
