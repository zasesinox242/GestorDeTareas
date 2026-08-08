import { BackgroundView } from "@/core/components/BackgroundView.component";
import { TaskHeader } from "../components/TaskHeader.component";
import { TaskForm } from "../components/TaskForm.component";
import { useNewTask } from "../hooks/useNewTask.hook";

export const NewTaskScreen = () => {
  const { task, isSaving, handleChange, handleSubmit } = useNewTask();

  return (
    <BackgroundView style={{ paddingTop: 20 }}>
      <TaskHeader title="Nueva tarea" />
      <TaskForm task={task} onChange={handleChange} onSubmit={handleSubmit} loading={isSaving} submitLabel="Crear tarea" />
    </BackgroundView>
  );
};
