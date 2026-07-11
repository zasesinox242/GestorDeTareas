import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/Login.screen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { CreateTaskScreen } from '../screens/CreateTask.screen';
import { EditTaskScreen } from '../screens/EditTask.screen';
import { ChangePasswordScreen } from '../screens/ChangePassword.screen';
import { MainTabs } from './MainTabs';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Usar un stack "de verdad" (react-navigation native-stack) es lo que hace
// que el botón físico/gesto de retroceso de Android cierre la pantalla
// actual en vez de sacar al usuario de la app: cada pantalla queda
// registrada en el historial de navegación en lugar de simularse con
// banderas de estado sueltas.
export const RootNavigator: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen
            name="CreateTask"
            component={CreateTaskScreen}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen name="EditTask" component={EditTaskScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
