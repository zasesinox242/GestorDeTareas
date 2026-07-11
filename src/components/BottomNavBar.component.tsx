import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppColors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { FabButton } from './FabButton.component';

// Debe coincidir con los nombres de las pestañas registradas en
// src/navigation/MainTabs.tsx
export type TabKey = 'tareas' | 'ajustes';

interface TabItem {
  key: TabKey;
  label: string;
  icon: string;
}

const TABS: TabItem[] = [
  { key: 'tareas', label: 'Tareas', icon: '✓' },
  { key: 'ajustes', label: 'Ajustes', icon: '⚙' },
];

interface BottomNavBarProps {
  activeTab: TabKey;
  onChangeTab: (key: TabKey) => void;
  onPressFab: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onChangeTab,
  onPressFab,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const renderTab = (tab: TabItem) => {
    const isActive = tab.key === activeTab;
    return (
      <TouchableOpacity
        key={tab.key}
        style={styles.tabButton}
        onPress={() => onChangeTab(tab.key)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.tabIcon,
            { color: isActive ? colors.navActive : colors.navInactive },
          ]}
        >
          {tab.icon}
        </Text>
        <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.bar, { paddingBottom: 14 + insets.bottom }]}>
        <View style={styles.tabGroup}>{renderTab(TABS[0])}</View>
        <View style={styles.fabSpacer} />
        <View style={styles.tabGroup}>{renderTab(TABS[1])}</View>
      </View>
      <FabButton onPress={onPressFab} />
    </View>
  );
};

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      position: 'relative',
    },
    bar: {
      flexDirection: 'row',
      backgroundColor: colors.navBackground,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: 14,
      paddingHorizontal: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 10,
    },
    tabGroup: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    tabButton: {
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 70,
    },
    tabIcon: {
      fontSize: 18,
      fontWeight: '600',
    },
    tabLabel: {
      fontSize: 12,
      color: colors.navInactive,
      marginTop: 4,
      fontWeight: '500',
    },
    tabLabelActive: {
      color: colors.navActive,
      fontWeight: '700',
    },
    fabSpacer: {
      width: 64,
    },
  });
