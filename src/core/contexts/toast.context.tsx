import { createContext, FC, ReactNode, useCallback, useContext, useRef, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeInUp,
  FadeOutUp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useThemeContext } from "./theme.context";

type ToastType = "success" | "error" | "info";

interface ToastState {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const AUTO_DISMISS_MS = 3200;

const ICON_BY_TYPE: Record<ToastType, keyof typeof Ionicons.glyphMap> = {
  success: "checkmark-circle",
  error: "alert-circle",
  info: "information-circle",
};

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { palette } = useThemeContext();
  const [toast, setToast] = useState<ToastState | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const translateY = useSharedValue(0);

  const dismiss = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast(null);
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      translateY.value = 0;

      if (type === "error") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (type === "success") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setToast({ id: Date.now(), type, message });
      timeoutRef.current = setTimeout(dismiss, AUTO_DISMISS_MS);
    },
    [dismiss, translateY],
  );

  // Deslizar hacia arriba para descartar antes de que se auto-oculte.
  const swipeUp = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY < 0) translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (event.translationY < -20) {
        translateY.value = withTiming(-200, { duration: 150 }, () => runOnJS(dismiss)());
      } else {
        translateY.value = withTiming(0);
      }
    });

  const dragStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backgroundByType: Record<ToastType, string> = {
    success: palette.colors.success,
    error: palette.colors.error,
    info: palette.colors.primary.default,
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <SafeAreaView style={styles.safeArea} pointerEvents="box-none">
          <GestureDetector gesture={swipeUp}>
            <Animated.View
              key={toast.id}
              entering={FadeInUp.springify().damping(16)}
              exiting={FadeOutUp}
              style={[
                styles.toast,
                dragStyle,
                { backgroundColor: backgroundByType[toast.type] },
              ]}
            >
              <Ionicons name={ICON_BY_TYPE[toast.type]} size={20} color="#fff" />
              <Text style={styles.message}>{toast.message}</Text>
            </Animated.View>
          </GestureDetector>
        </SafeAreaView>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast debe usarse dentro de un ToastProvider");
  return context;
};

const styles = StyleSheet.create({
  safeArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
    marginHorizontal: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    maxWidth: 480,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  message: { color: "#fff", fontWeight: "600", flexShrink: 1 },
});
