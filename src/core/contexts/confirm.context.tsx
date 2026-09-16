import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { CustomButton } from "../components/CustomButton.component";
import { useThemeContext } from "./theme.context";

interface ConfirmOptions {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  /** Si es true, el botón de confirmar se pinta en rojo (para acciones destructivas como borrar). */
  destructive?: boolean;
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | undefined>(undefined);

/**
 * Contenido animado del modal. La visibilidad real del Modal nativo depende
 * únicamente del estado `options` (no de esta animación) — esto solo agrega
 * el efecto visual, animado a mano en vez de con `entering`/`exiting` (ver
 * nota en AppSplash.component.tsx sobre por qué).
 */
const ConfirmCard: FC<{ options: ConfirmOptions; palette: any; onRespond: (value: boolean) => void }> = ({
  options,
  palette,
  onRespond,
}) => {
  const backdropOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.85);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    backdropOpacity.value = withTiming(1, { duration: 180 });
    cardOpacity.value = withTiming(1, { duration: 200 });
    cardScale.value = withTiming(1, { duration: 220, easing: Easing.out(Easing.back(1.4)) });
  }, [backdropOpacity, cardOpacity, cardScale]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  return (
    <Animated.View style={[styles.backdrop, backdropStyle]}>
      <Animated.View style={[styles.card, cardStyle, { backgroundColor: palette.colors.surface }]}>
        <Text style={[styles.title, { color: palette.texts.primary }]}>{options.title}</Text>
        {!!options.message && (
          <Text style={[styles.message, { color: palette.texts.secondary }]}>{options.message}</Text>
        )}

        <View style={styles.actions}>
          <CustomButton
            title={options.cancelText ?? "Cancelar"}
            variant="outlined"
            color="secondary"
            onPress={() => onRespond(false)}
            style={styles.actionButton}
          />
          <CustomButton
            title={options.confirmText ?? "Confirmar"}
            color={options.destructive ? "error" : "primary"}
            onPress={() => onRespond(true)}
            style={styles.actionButton}
          />
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export const ConfirmProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { palette } = useThemeContext();
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolverRef = useRef<((value: boolean) => void) | undefined>(undefined);

  const confirm = useCallback<ConfirmFn>((opts) => {
    setOptions(opts);
    return new Promise((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const respond = (value: boolean) => {
    setOptions(null);
    resolverRef.current?.(value);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      <Modal visible={!!options} transparent animationType="none" onRequestClose={() => respond(false)}>
        {options && <ConfirmCard options={options} palette={palette} onRespond={respond} />}
      </Modal>
    </ConfirmContext.Provider>
  );
};

export const useConfirm = (): ConfirmFn => {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error("useConfirm debe usarse dentro de un ConfirmProvider");
  return context;
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  title: { fontSize: 18, fontWeight: "700" },
  message: { fontSize: 14, marginBottom: 12 },
  actions: { flexDirection: "row", gap: 12 },
  actionButton: { flex: 1 },
});
