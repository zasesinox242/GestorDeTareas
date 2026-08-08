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

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: palette.colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
        style,
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
