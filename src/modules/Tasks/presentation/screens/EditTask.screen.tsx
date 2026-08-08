import { ActivityIndicator } from "react-native";
import { BackgroundView } from "@/core/components/BackgroundView.component";
import { CustomButton } from "@/core/components/CustomButton.component";
import { TaskHeader } from "../components/TaskHeader.component";
import { TaskForm } from "../components/TaskForm.component";
import { useEditTask } from "../hooks/useEditTask.hook";

export const EditTaskScreen = () => {
  const { task, isLoading, isSaving, handleChange, handleSubmit, handleDelete } = useEditTask();

  return (
    <BackgroundView>
      <TaskHeader title="Editar tarea" />
      {isLoading || !task ? (
        <ActivityIndicator />
      ) : (
        <>
          <TaskForm
            task={task}
            onChange={handleChange}
            onSubmit={handleSubmit}
            loading={isSaving}
            submitLabel="Guardar cambios"
          />
          <CustomButton title="Eliminar tarea" color="error" variant="outlined" onPress={handleDelete} />
        </>
      )}
    </BackgroundView>
  );
};
