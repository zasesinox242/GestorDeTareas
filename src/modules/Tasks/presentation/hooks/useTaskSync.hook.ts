import { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { useAuthContext } from "@/modules/Auth/presentation/contexts/auth.context";
import { useTaskDependencies } from "../contexts/task-dependencies.context";

export const useTaskSync = () => {
  const { user } = useAuthContext();
  const { syncTasksUseCase } = useTaskDependencies();

  useEffect(() => {
    if (!user?.id) return;
    const ownerId = user.id; // <- guarda el valor ya validado en una constante nueva

    const runSync = () => {
      syncTasksUseCase.execute(ownerId).catch(() => undefined);
    };

    runSync();

    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable !== false) {
        runSync();
      }
    });

    return unsubscribe;
  }, [user?.id, syncTasksUseCase]);
};