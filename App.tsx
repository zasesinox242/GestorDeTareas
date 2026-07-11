//import React from 'react';
//import { SafeAreaProvider } from 'react-native-safe-area-context';
//import { HomeScreen } from './src/screens/Home.screen';
//export default function App() {
  //return (
    //<SafeAreaProvider>
      //<HomeScreen />
    //</SafeAreaProvider>
  //);
//}

import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { HomeScreen } from './src/screens/Home.screen';
import { LoginScreen } from './src/screens/Login.screen';
import { RegisterScreen } from './src/screens/RegisterScreen';

export default function App() {

  const [isLogged, setIsLogged] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (

    <SafeAreaProvider>

      {!isLogged ? (

        showRegister ? (

          <RegisterScreen
            onBack={() => setShowRegister(false)}
          />

        ) : (

          <LoginScreen
            onLogin={() => setIsLogged(true)}
            onRegister={() => setShowRegister(true)}
          />

        )

      ) : (

        <HomeScreen
        onLogout={() => setIsLogged(false)}
         />

      )}

    </SafeAreaProvider>

  );

}