import React, { useMemo } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

import { AppColors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

interface BackButtonProps {
  onPress: () => void;
  label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  label = 'Volver',
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity
      style={styles.backButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.backIcon}>‹</Text>
      <Text style={styles.backText}>{label}</Text>
    </TouchableOpacity>
  );
};

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingTop: 12,
    },
    backIcon: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.primary,
      marginRight: 4,
      lineHeight: 22,
    },
    backText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
    },
  });
