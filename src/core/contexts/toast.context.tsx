import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
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
const FADE_MS = 220;

const ICON_BY_TYPE: Record<ToastType, keyof typeof Ionicons.glyphMap> = {
  success: "checkmark-circle",
  error: "alert-circle",
  info: "information-circle",
};

/**
 * Banner individual. IMPORTANTE: la entrada y la salida se animan a mano con
 * withTiming + setTimeout, en vez de las props `entering`/`exiting` de
 * Reanimated. Esas props dependen de que el motor de animaciones avise
 * cuándo terminó, y en ciertos entornos ese aviso nunca llega, dejando la
 * vista congelada en pantalla. Un temporizador de JS siempre se dispara.
 */
const ToastBanner: FC<{
  toast: ToastState;
  backgroundColor: string;
  onRequestClose: () => void;
}> = ({ toast, backgroundColor, onRequestClose }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-24);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: FADE_MS });
    translateY.value = withTiming(0, { duration: FADE_MS });

    const autoCloseTimer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: FADE_MS });
      translateY.value = withTiming(-24, { duration: FADE_MS });
    }, AUTO_DISMISS_MS - FADE_MS);

    // Este es el único responsable real de sacar el toast de pantalla.
    const removeTimer = setTimeout(onRequestClose, AUTO_DISMISS_MS);

    return () => {
      clearTimeout(autoCloseTimer);
      clearTimeout(removeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast.id]);

  const swipeUp = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY < 0) translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (event.translationY < -20) {
        opacity.value = withTiming(0, { duration: 150 });
        translateY.value = withTiming(-200, { duration: 150 }, () => runOnJS(onRequestClose)());
      } else {
        translateY.value = withTiming(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={swipeUp}>
      <Animated.View style={[styles.toast, animatedStyle, { backgroundColor }]}>
        <Ionicons name={ICON_BY_TYPE[toast.type]} size={20} color="#fff" />
        <Text style={styles.message}>{toast.message}</Text>
      </Animated.View>
    </GestureDetector>
  );
};

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { palette } = useThemeContext();
  const [toast, setToast] = useState<ToastState | null>(null);
  const closeGuardRef = useRef(0);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    if (type === "error") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    if (type === "success") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const id = Date.now();
    closeGuardRef.current = id;
    setToast({ id, type, message });
  }, []);

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
          <ToastBanner
            key={toast.id}
            toast={toast}
            backgroundColor={backgroundByType[toast.type]}
            onRequestClose={() => {
              // Evita que un cierre "viejo" borre un toast más nuevo que ya
              // lo reemplazó (por ejemplo, dos errores seguidos muy rápido).
              if (closeGuardRef.current === toast.id) setToast(null);
            }}
          />
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
