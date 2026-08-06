import React, { useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import { AppColors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

interface FabButtonProps {
  onPress: () => void;
  label?: string;
}

export const FabButton: React.FC<FabButtonProps> = ({
  onPress,
  label = '+',
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={styles.fabLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    fab: {
      position: 'absolute',
      top: -28,
      left: '50%',
      marginLeft: -32,
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.primaryDark,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
      elevation: 8,
    },
    fabLabel: {
      color: colors.surface,
      fontSize: 32,
      fontWeight: '400',
      lineHeight: 32,
    },
  });
