import { ActivityIndicator } from "react-native";
import { BackgroundView } from "@/core/components/BackgroundView.component";
import { TaskHeader } from "../components/TaskHeader.component";
import { TaskForm } from "../components/TaskForm.component";
import { useEditTask } from "../hooks/useEditTask.hook";

export const EditTaskScreen = () => {
  const { task, isLoading, isSaving, isUploadingImage, handleChange, handleSubmit, handlePickImage } =
    useEditTask();

  return (
    <BackgroundView>
      <TaskHeader title="Editar tarea" />
      {isLoading || !task ? (
        <ActivityIndicator />
      ) : (
        <TaskForm
          task={task}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={isSaving}
          submitLabel="Guardar cambios"
          onPickImage={handlePickImage}
          isUploadingImage={isUploadingImage}
        />
      )}
    </BackgroundView>
  );
};