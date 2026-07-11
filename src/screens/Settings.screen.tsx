import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';

import { colors } from '../theme/colors';

interface Props{

    onBack:()=>void;
    onChangePassword:()=>void;
    onLogout:()=>void;

}

export const SettingsScreen = ({

    onBack,
    onChangePassword,
    onLogout

}:Props)=>{

    

  return (


    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>Ajustes</Text>

      {/* Cuenta */}

      <View style={styles.card}>

        <Text style={styles.section}>👤 Cuenta</Text>

        <View style={styles.profile}>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </View>

          <View>

            <Text style={styles.name}>ABIGAIL</Text>

            <Text style={styles.subtitle}>
              Administrador
            </Text>

          </View>

        </View>

        <View style={styles.separator}/>

        <Text style={styles.label}>
          Usuario
        </Text>

        <Text style={styles.value}>
          @abigail
        </Text>

        <Text style={styles.label}>
          Correo
        </Text>

        <Text style={styles.value}>
          abigail@gmail.com
        </Text>

<TouchableOpacity
    style={styles.button}
    onPress={onChangePassword}>
    <Text style={styles.buttonText}>
        Cambiar contraseña
    </Text>

</TouchableOpacity>


        <TouchableOpacity onPress={onLogout}>

          <Text style={styles.logout}>
            Cerrar sesión
          </Text>

        </TouchableOpacity>

      </View>


      {/* Productividad */}

      <View style={styles.card}>

        <Text style={styles.section}>
          🎯 Productividad
        </Text>

        <Text style={styles.percent}>
          0%
        </Text>

        <View style={styles.progress}>

          <View style={styles.progressFill}/>

        </View>

      </View>

      {/* Apariencia */}

      <View style={styles.card}>

        <Text style={styles.section}>
          🎨 Apariencia
        </Text>

        <View style={styles.row}>

          <Text>
            Modo oscuro
          </Text>

          <Switch value={false}/>

        </View>

      </View>

  <TouchableOpacity onPress={onBack}>
  <Text style={styles.back}>
    ← Volver a tareas
  </Text>
</TouchableOpacity>

    </SafeAreaView>

  );

};

const styles=StyleSheet.create({

container:{
flex:1,
backgroundColor:colors.background,
padding:20,
},

title:{
fontSize:30,
fontWeight:'700',
color:colors.textPrimary,
marginBottom:20,
},

card:{
backgroundColor:colors.surface,
borderRadius:18,
padding:18,
marginBottom:18,
},

section:{
fontSize:18,
fontWeight:'700',
marginBottom:15,
color:colors.textPrimary,
},

profile:{
flexDirection:'row',
alignItems:'center',
},

avatar:{
width:60,
height:60,
borderRadius:30,
backgroundColor:colors.primary,
justifyContent:'center',
alignItems:'center',
marginRight:15,
},

avatarText:{
color:'white',
fontWeight:'700',
fontSize:22,
},

name:{
fontSize:20,
fontWeight:'700',
},

subtitle:{
color:colors.textSecondary,
},

separator:{
height:1,
backgroundColor:'#E6E6E6',
marginVertical:15,
},

label:{
color:colors.textSecondary,
marginTop:10,
},

value:{
fontWeight:'700',
fontSize:16,
marginTop:4,
},

button:{
marginTop:20,
backgroundColor:colors.primary,
padding:14,
borderRadius:10,
alignItems:'center',
},

buttonText:{
color:'white',
fontWeight:'700',
},

logout:{
textAlign:'center',
marginTop:20,
color:colors.danger,
fontWeight:'700',
},

percent:{
fontSize:26,
fontWeight:'700',
},

progress:{
height:10,
backgroundColor:'#DDD',
borderRadius:20,
marginTop:15,
},

progressFill:{
height:10,
width:'30%',
backgroundColor:colors.primary,
borderRadius:20,
},

row:{
flexDirection:'row',
justifyContent:'space-between',
alignItems:'center',
},
back: {
    textAlign:'center',
    color:colors.primary,
    fontWeight:'700',
    marginTop:15,
    marginBottom:20,
},

});