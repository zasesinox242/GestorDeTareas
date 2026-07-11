import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { colors } from '../theme/colors';

interface Props {
  onBack: () => void;
}

export const ChangePasswordScreen = ({
    onBack
}:Props)=>{

  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');

  const guardarCambios = () => {
    // ===== INICIO CAMBIO - Abigail =====
    // Aquí posteriormente se podrá validar y guardar la contraseña.
    // ===== FIN CAMBIO - Abigail =====

    onBack();
  };

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>
        Cambiar contraseña
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Contraseña actual"
        secureTextEntry
        value={actual}
        onChangeText={setActual}
      />

      <TextInput
        style={styles.input}
        placeholder="Nueva contraseña"
        secureTextEntry
        value={nueva}
        onChangeText={setNueva}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        secureTextEntry
        value={confirmar}
        onChangeText={setConfirmar}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={guardarCambios}
      >
        <Text style={styles.buttonText}>
          Guardar cambios
        </Text>
      </TouchableOpacity>

<TouchableOpacity
    onPress={onBack}
>

    <Text style={styles.back}>
        ← Volver
    </Text>

</TouchableOpacity>

    </SafeAreaView>
  );

};

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:colors.background,
padding:20,
},

title:{
fontSize:28,
fontWeight:'700',
marginBottom:25,
color:colors.textPrimary,
},

input:{
backgroundColor:colors.surface,
padding:15,
borderRadius:10,
marginBottom:15,
},

button:{
backgroundColor:colors.primary,
padding:15,
borderRadius:10,
alignItems:'center',
marginTop:10,
},

buttonText:{
color:'white',
fontWeight:'700',
},

back:{
marginTop:25,
textAlign:'center',
color:colors.primary,
fontWeight:'700',
}

});