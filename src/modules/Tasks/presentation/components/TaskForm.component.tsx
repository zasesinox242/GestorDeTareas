import { FC } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";
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
  /** Solo se puede subir imagen cuando la tarea ya existe (tiene id). */
  onPickImage?: VoidFunction;
  isUploadingImage?: boolean;
  /** Deshabilita título/descripción/prioridad (usado tras crear la tarea, en la etapa de agregar foto). */
  disabled?: boolean;
}

export const TaskForm: FC<TaskFormProps> = ({
  task,
  onChange,
  onSubmit,
  loading,
  submitLabel = "Guardar",
  onPickImage,
  isUploadingImage,
  disabled,
}) => {
  const { palette } = useThemeContext();

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <InputField
        label="Título"
        placeholder="Título de la tarea"
        value={task.titulo}
        onChangeText={(value) => onChange("titulo", value)}
        editable={!disabled}
      />

      <InputField
        label="Descripción"
        placeholder="Detalles (opcional)"
        multiline
        value={task.descripcion}
        onChangeText={(value) => onChange("descripcion", value)}
        editable={!disabled}
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
            disabled={disabled}
          />
        ))}
      </View>

      {onPickImage && (
        <View style={styles.imageSection}>
          <Text style={[styles.label, { color: palette.texts.primary }]}>Foto</Text>

          {!!task.imagenUrl && (
            <Image source={{ uri: task.imagenUrl }} style={styles.imagePreview} />
          )}

          <CustomButton
            title={task.imagenUrl ? "Cambiar imagen" : "Agregar imagen"}
            variant="outlined"
            onPress={onPickImage}
            disabled={isUploadingImage}
          />

          {isUploadingImage && <ActivityIndicator />}
        </View>
      )}

      <CustomButton title={submitLabel} onPress={onSubmit} disabled={loading} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: { gap: 16, paddingBottom: 40 },
  label: { fontSize: 16, fontWeight: "500" },
  prioridadRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  prioridadItem: { paddingHorizontal: 12, paddingVertical: 10 },
  imageSection: { gap: 8 },
  imagePreview: { width: "100%", height: 200, borderRadius: 12 },
});
