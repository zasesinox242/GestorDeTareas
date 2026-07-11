import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { AppColors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { ScreenHeader } from '../components/ScreenHeader.component';
import { PrimaryButton } from '../components/PrimaryButton.component';
import { BackButton } from '../components/BackButton.component';
import { TaskPriority, TASK_PRIORITIES } from '../models/Task';
import { useTasks } from '../context/TasksContext';
import { RootStackParamList } from '../navigation/types';

type EditTaskRoute = RouteProp<RootStackParamList, 'EditTask'>;

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  BAJA: 'Baja',
  MEDIA: 'Media',
  ALTA: 'Alta',
};

// Pantalla para editar una tarea existente. La tarea se busca por id
// dentro de useTasks(), en vez de recibirla directamente como prop.
export const EditTaskScreen: React.FC = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation();
  const route = useRoute<EditTaskRoute>();
  const { tasks, updateTask } = useTasks();

  const task = tasks.find((t) => t.id === route.params.taskId);

  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'MEDIA');

  if (!task) {
    // Puede pasar si la tarea fue eliminada mientras se navegaba hacia aquí.
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.container}>
          <Text style={styles.errorText}>
            Esta tarea ya no existe.
          </Text>
          <PrimaryButton title="Volver" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const isTitleValid = title.trim() !== '';
  const isDescriptionValid = description.trim() !== '';
  const isFormValid = isTitleValid && isDescriptionValid;

  const handleSave = () => {
    // El estado (pendiente/finalizada) no se toca desde aquí: se conserva
    // tal cual estaba y sólo se cambia con el checkbox del listado.
    updateTask({
      ...task,
      title: title.trim(),
      description: description.trim(),
      priority,
    });
    Alert.alert('Tarea actualizada', 'Los cambios se guardaron correctamente.', [
      { text: 'Aceptar', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <BackButton onPress={() => navigation.goBack()} label="Volver al listado" />

      <ScreenHeader
        title="Editar tarea"
        subtitle="Actualiza la información de la tarea"
      />

      <View style={styles.container}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Comprar víveres"
          placeholderTextColor={colors.textSecondary}
          value={title}
          onChangeText={setTitle}
        />
        {!isTitleValid && (
          <Text style={styles.fieldError}>El título es obligatorio.</Text>
        )}

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe la tarea..."
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />
        {!isDescriptionValid && (
          <Text style={styles.fieldError}>La descripción es obligatoria.</Text>
        )}

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
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
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
      color: colors.textPrimary,
      borderWidth: 1,
      borderColor: colors.border,
    },
    textArea: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 15,
      height: 120,
      color: colors.textPrimary,
      textAlignVertical: 'top',
      borderWidth: 1,
      borderColor: colors.border,
    },
    fieldError: {
      fontSize: 12,
      color: colors.danger,
      marginTop: 6,
    },
    errorText: {
      fontSize: 15,
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: 20,
      marginTop: 40,
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
      borderColor: colors.border,
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
