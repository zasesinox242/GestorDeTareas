import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { ScreenHeader } from '../components/ScreenHeader.component';
import { BottomNavBar, TabKey } from '../components/BottomNavBar.component';
import { TaskCard } from '../components/TaskCard.component';
import { CreateTaskScreen } from './CreateTask.screen';
import { EditTaskScreen } from './EditTask.screen';
import { Task } from '../models/Task';
import { SettingsScreen } from './Settings.screen';
import { ChangePasswordScreen } from './ChangePassword.screen';




// Datos de ejemplo en memoria, mientras no exista un Context/Reducer global.
// Sirven para poder ver y probar el listado + la edición en la demo.
const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Comprar víveres',
    description: 'Ir al mercado y comprar frutas, verduras y pan.',
    status: 'PENDIENTE',
    priority: 'MEDIA',
  },
  {
    id: '2',
    title: 'Entregar informe de sprint',
    description: 'Terminar el documento y subirlo al repositorio.',
    status: 'EN_PROCESO',
    priority: 'ALTA',
  },
];



export const HomeScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('tareas');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // useEffect: simula la carga inicial de tareas (como si viniera de un servidor)
  useEffect(() => {
    const timer = setTimeout(() => {
      setTasks(INITIAL_TASKS);
      setIsLoading(false);
    }, 800);

    // Limpieza: cancela el temporizador si la pantalla se desmonta antes de tiempo
    return () => clearTimeout(timer);
  }, []);

  const handleCreateTask = () => {
  setShowCreateTask(true);
  };

  // Crea la tarea nueva, la agrega al inicio del listado y regresa a Home
  const handleAddTask = (data: { title: string; description: string }) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      status: 'PENDIENTE',
      priority: 'MEDIA',
    };
    setTasks((prev) => [newTask, ...prev]);
    setShowCreateTask(false);
  };

  // Abre la pantalla de edición con la tarea seleccionada
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  // Actualiza la tarea editada dentro del listado y vuelve a Home
  const handleSaveTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    setEditingTask(null);
  };

  // Pide confirmación antes de eliminar y luego quita la tarea del listado
  const handleDeleteTask = (task: Task) => {
    Alert.alert(
      'Eliminar tarea',
      `¿Seguro que deseas eliminar "${task.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setTasks((prev) => prev.filter((t) => t.id !== task.id));
          },
        },
      ]
    );
  };

  const handleChangeTab = (tab: TabKey) => {

    setActiveTab(tab);

    if (tab === 'ajustes') {
        setShowSettings(true);
    }

};

  if(showSettings){

    return(

        <SettingsScreen
            onBack={()=>{
                setShowSettings(false);
                setActiveTab('tareas');
            }}
            onChangePassword={()=>{
                setShowSettings(false);
                setShowChangePassword(true);
            }}
        />

    );

}

if(showChangePassword){
    return(
        <ChangePasswordScreen
            onBack={()=>{
                setShowChangePassword(false);
                setShowSettings(true);
            }}
        />

    );

}





  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando tareas...</Text>
        </View>
      </SafeAreaView>
    );
  }




  if (showCreateTask) {
    return (
      <CreateTaskScreen
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onPressFab={handleCreateTask}
        onBack={() => setShowCreateTask(false)}
        onCreate={handleAddTask}
      />
    );
  }

  if (editingTask) {
    return (
      <EditTaskScreen
        task={editingTask}
        onSave={handleSaveTask}
        onCancel={() => setEditingTask(null)}
      />
    );
  }





  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.content}>
        <ScreenHeader
          title="Mis Tareas"
          subtitle="Organiza tu día, una tarea a la vez"
        />

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskCard task={item} onEdit={handleEditTask} onDelete={handleDeleteTask} />
          )}
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
  onChangeTab={handleChangeTab}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
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
