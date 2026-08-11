import { BackgroundView } from "@/core/components/BackgroundView.component";
import { TaskHeader } from "../components/TaskHeader.component";
import { TaskForm } from "../components/TaskForm.component";
import { useNewTask } from "../hooks/useNewTask.hook";

export const NewTaskScreen = () => {
  const {
    task,
    isSaving,
    isUploadingImage,
    isCreated,
    handleChange,
    handleSubmit,
    handlePickImage,
    handleFinish,
  } = useNewTask();

  return (
    <BackgroundView>
      <TaskHeader title="Nueva tarea" />
      <TaskForm
        task={task}
        onChange={handleChange}
        onSubmit={isCreated ? handleFinish : handleSubmit}
        loading={isSaving}
        submitLabel={isCreated ? "Listo" : "Crear tarea"}
        disabled={isCreated}
        onPickImage={isCreated ? handlePickImage : undefined}
        isUploadingImage={isUploadingImage}
      />
    </BackgroundView>
  );
};