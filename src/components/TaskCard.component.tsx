import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { Task, TaskStatus, TaskPriority } from '../models/Task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const STATUS_LABEL: Record<TaskStatus, string> = {
  PENDIENTE: 'Pendiente',
  EN_PROCESO: 'En proceso',
  FINALIZADA: 'Finalizada',
};

const STATUS_COLOR: Record<TaskStatus, string> = {
  PENDIENTE: '#F59E0B',
  EN_PROCESO: '#0E9F6E',
  FINALIZADA: '#6B7280',
};

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  BAJA: 'Baja',
  MEDIA: 'Media',
  ALTA: 'Alta',
};

const PRIORITY_COLOR: Record<TaskPriority, string> = {
  BAJA: '#3B82F6',
  MEDIA: '#F59E0B',
  ALTA: '#F4573D',
};

// Tarjeta que representa una tarea en el listado principal
export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={1}>
          {task.title}
        </Text>

        <View style={styles.actionsRow}>
          {/* Botón que conecta con la pantalla de edición */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onEdit(task)}
            activeOpacity={0.7}
          >
            <Text style={styles.editIcon}>✏️</Text>
            <Text style={styles.editText}>Editar</Text>
          </TouchableOpacity>

          {/* Botón que pide confirmación y elimina la tarea */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(task)}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {task.description}
      </Text>

      <View style={styles.chipsRow}>
        <View style={[styles.chip, { backgroundColor: STATUS_COLOR[task.status] + '22' }]}>
          <Text style={[styles.chipText, { color: STATUS_COLOR[task.status] }]}>
            {STATUS_LABEL[task.status]}
          </Text>
        </View>
        <View style={[styles.chip, { backgroundColor: PRIORITY_COLOR[task.priority] + '22' }]}>
          <Text style={[styles.chipText, { color: PRIORITY_COLOR[task.priority] }]}>
            {PRIORITY_LABEL[task.priority]}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ECEFF3',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginRight: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  deleteIcon: {
    fontSize: 14,
  },
  editIcon: {
    fontSize: 13,
    marginRight: 4,
  },
  editText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
