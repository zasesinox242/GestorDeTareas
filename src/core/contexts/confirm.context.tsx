import { createContext, FC, ReactNode, useCallback, useContext, useRef, useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut, ZoomIn } from "react-native-reanimated";
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
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.backdrop}>
          {options && (
            <Animated.View
              entering={ZoomIn.springify().damping(18)}
              style={[styles.card, { backgroundColor: palette.colors.surface }]}
            >
              <Text style={[styles.title, { color: palette.texts.primary }]}>{options.title}</Text>
              {!!options.message && (
                <Text style={[styles.message, { color: palette.texts.secondary }]}>
                  {options.message}
                </Text>
              )}

              <View style={styles.actions}>
                <CustomButton
                  title={options.cancelText ?? "Cancelar"}
                  variant="outlined"
                  color="secondary"
                  onPress={() => respond(false)}
                  style={styles.actionButton}
                />
                <CustomButton
                  title={options.confirmText ?? "Confirmar"}
                  color={options.destructive ? "error" : "primary"}
                  onPress={() => respond(true)}
                  style={styles.actionButton}
                />
              </View>
            </Animated.View>
          )}
        </Animated.View>
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
