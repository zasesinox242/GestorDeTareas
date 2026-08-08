import { FC } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, View, ViewProps } from "react-native";
import { useThemeContext } from "../contexts/theme.context";

export const BackgroundView: FC<ViewProps> = ({
  children,
  style,
  ...props
}) => {
  const insets = useSafeAreaInsets();
  const { palette } = useThemeContext();

  // Cualquier paddingTop/paddingBottom que venga en `style` se trata como
  // espacio EXTRA, no como reemplazo del safe area: así ninguna pantalla
  // puede terminar chocando con la barra de estado o de notificaciones.
  const { paddingTop: extraTop = 0, paddingBottom: extraBottom = 0, ...restStyle } =
    (StyleSheet.flatten(style) ?? {}) as {
      paddingTop?: number;
      paddingBottom?: number;
      [key: string]: unknown;
    };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: palette.colors.background,
          paddingTop: insets.top + Number(extraTop),
          paddingBottom: insets.bottom + Number(extraBottom),
        },
        restStyle,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
