import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { AppColors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { ScreenHeader } from '../components/ScreenHeader.component';
import { PrimaryButton } from '../components/PrimaryButton.component';
import { BackButton } from '../components/BackButton.component';
import { TaskPriority, TASK_PRIORITIES } from '../models/Task';
import { useTasks } from '../context/TasksContext';

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  BAJA: 'Baja',
  MEDIA: 'Media',
  ALTA: 'Alta',
};

// Pantalla para crear una nueva tarea. No conoce AsyncStorage ni el listado
// completo: sólo arma los datos del formulario y le pide a useTasks()
// que agregue la tarea.
export const CreateTaskScreen: React.FC = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation();
  const { addTask } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('MEDIA');
  const isFormValid = title.trim() !== '' && description.trim() !== '';

  const handleCreateTask = () => {
    addTask({ title: title.trim(), description: description.trim(), priority });
    Alert.alert('Tarea creada', 'La tarea se registró correctamente.', [
      { text: 'Aceptar', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.content}>
        <BackButton onPress={() => navigation.goBack()} label="Volver al listado" />

        <ScreenHeader
          title="Crear tarea"
          subtitle="Completa la información de la tarea"
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
            title="Crear tarea"
            onPress={handleCreateTask}
            disabled={!isFormValid}
          />
        </View>
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
    content: {
      flex: 1,
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
  });
