import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HomeScreen } from '../screens/Home.screen';
import { SettingsScreen } from '../screens/Settings.screen';
import { CustomTabBar } from './CustomTabBar';
import { MainTabsParamList } from './types';

const Tab = createBottomTabNavigator<MainTabsParamList>();

// Pestañas visibles después del login: Tareas y Ajustes, ambas con la
// misma barra inferior (y el FAB de "agregar tarea") gracias a CustomTabBar.
export const MainTabs: React.FC = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="tareas" component={HomeScreen} />
    <Tab.Screen name="ajustes" component={SettingsScreen} />
  </Tab.Navigator>
);
