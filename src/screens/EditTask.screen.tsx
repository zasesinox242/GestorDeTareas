// useState permite guardar información que cambia en la pantalla
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { ScreenHeader } from '../components/ScreenHeader.component';
import { PrimaryButton } from '../components/PrimaryButton.component';
import {
  Task,
  TaskStatus,
  TaskPriority,
  TASK_STATUSES,
  TASK_PRIORITIES,
} from '../models/Task';

interface EditTaskScreenProps {
  task: Task;
  onSave: (updatedTask: Task) => void;
  onCancel: () => void;
}

const STATUS_LABEL: Record<TaskStatus, string> = {
  PENDIENTE: 'Pendiente',
  EN_PROCESO: 'En proceso',
  FINALIZADA: 'Finalizada',
};

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  BAJA: 'Baja',
  MEDIA: 'Media',
  ALTA: 'Alta',
};

// Pantalla para editar una tarea existente (recibe la tarea por props, sin ruteo)
export const EditTaskScreen: React.FC<EditTaskScreenProps> = ({
  task,
  onSave,
  onCancel,
}) => {
  // Los campos inician con los valores actuales de la tarea
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);

  // Validación simple: título y descripción no pueden quedar vacíos
  const isTitleValid = title.trim() !== '';
  const isDescriptionValid = description.trim() !== '';
  const isFormValid = isTitleValid && isDescriptionValid;

  // Guarda los cambios y regresa al listado
  const handleSave = () => {
    onSave({
      ...task,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
    });
    Alert.alert('Tarea actualizada', 'Los cambios se guardaron correctamente.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Editar tarea"
        subtitle="Actualiza la información de la tarea"
      />

      <View style={styles.container}>
        {/* Campo para el título */}
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Comprar víveres"
          value={title}
          onChangeText={setTitle}
        />
        {!isTitleValid && (
          <Text style={styles.errorText}>El título es obligatorio.</Text>
        )}

        {/* Campo para la descripción */}
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe la tarea..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />
        {!isDescriptionValid && (
          <Text style={styles.errorText}>La descripción es obligatoria.</Text>
        )}

        {/* Selector de estado */}
        <Text style={styles.label}>Estado</Text>
        <View style={styles.chipsRow}>
          {TASK_STATUSES.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.chip, status === item && styles.chipSelected]}
              onPress={() => setStatus(item)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  status === item && styles.chipTextSelected,
                ]}
              >
                {STATUS_LABEL[item]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Selector de prioridad */}
        <Text style={styles.label}>Prioridad</Text>
        <View style={styles.chipsRow}>
          {TASK_PRIORITIES.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.chip, priority === item && styles.chipSelected]}
              onPress={() => setPriority(item)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  priority === item && styles.chipTextSelected,
                ]}
              >
                {PRIORITY_LABEL[item]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <PrimaryButton
          title="Guardar cambios"
          onPress={handleSave}
          disabled={!isFormValid}
        />

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    height: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    marginTop: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: colors.surface,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: colors.surface,
  },
  cancelButton: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
