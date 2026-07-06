import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { ScreenHeader } from '../components/ScreenHeader.component';
import { BottomNavBar, TabKey } from '../components/BottomNavBar.component';

export const HomeScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('tareas');

  const handleCreateTask = () => {
    // Aquí más adelante navegarás a la pantalla "Crear tarea"
    console.log('Crear tarea');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.content}>
        <ScreenHeader
          title="Mis Tareas"
          subtitle="Organiza tu día, una tarea a la vez"
        />

        {/* FlatList vacía: aquí se renderizará la lista de tareas más adelante */}
        <FlatList
          data={[]}
          keyExtractor={(_, index) => String(index)}
          renderItem={null}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>Aún no tienes tareas</Text>
              <Text style={styles.emptyText}>
                Usa el botón + para crear tu primera tarea.
              </Text>
            </View>
          }
        />
      </View>

      <BottomNavBar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onPressFab={handleCreateTask}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 12,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
});
