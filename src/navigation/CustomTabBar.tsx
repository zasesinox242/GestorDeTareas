import React from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { BottomNavBar, TabKey } from '../components/BottomNavBar.component';

// Puente entre el Tab.Navigator de react-navigation y nuestro componente
// visual BottomNavBar (que ya incluye el botón grande de "agregar tarea").
// El botón de agregar navega a "CreateTask", que vive un nivel arriba
// (en el stack raíz), por eso se usa navigation.getParent().
export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  navigation,
}) => {
  const activeTab = state.routes[state.index].name as TabKey;

  const handleChangeTab = (key: TabKey) => {
    navigation.navigate(key);
  };

  const handlePressFab = () => {
    navigation.getParent()?.navigate('CreateTask');
  };

  return (
    <BottomNavBar
      activeTab={activeTab}
      onChangeTab={handleChangeTab}
      onPressFab={handlePressFab}
    />
  );
};
