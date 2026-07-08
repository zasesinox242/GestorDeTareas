// useState permite guardar información que cambia en la pantalla
import React, { useState } from 'react'; 
// Alert muestra un mensaje emergente en la pantalla
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { ScreenHeader } from '../components/ScreenHeader.component';
import { PrimaryButton } from '../components/PrimaryButton.component';


// Pantalla para crear una nueva tarea
export const CreateTaskScreen: React.FC = () => {
 // Guarda la información escrita por el usuario
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    // El botón solo se habilita cuando ambos campos tienen contenido
    const isFormValid =title.trim() !== '' && description.trim() !== '';
    // Simula el registro de una nueva tarea
    const handleCreateTask = () => {Alert.alert('Tarea creada','La tarea se registró correctamente.');
    // Reinicia los campos después de crear la tarea
    setTitle('');setDescription('');
};

    return (
    // Evita que el contenido quede debajo de la barra de estado o notch
    <SafeAreaView style={styles.safeArea}>

      {/* Encabezado reutilizable del proyecto */}
      <ScreenHeader
        title="Crear tarea"
        subtitle="Completa la información de la tarea"
      />

      {/* Aquí irá el formulario de creación */}
      <View style={styles.container}>

        {/* Campo para el título */}
        <Text style={styles.label}>Título</Text>

        {/* Campo para ingresar el título de la tarea*/}
        <TextInput
        style={styles.input}
            placeholder="Ej. Comprar víveres"
            value={title}// value muestra el valor actual
            onChangeText={setTitle}//onChangeText lo actualiza
        />

        {/* Campo para la descripción */}
        <Text style={styles.label}>Descripción</Text>

        <TextInput
            style={styles.textArea}
            placeholder="Describe la tarea..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
        />
        <PrimaryButton
            title="Crear tarea"
            onPress={handleCreateTask}
            disabled={!isFormValid}
        />
        </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
safeArea: {
    flex: 1, // Ocupa toda la pantalla
    backgroundColor: colors.background,
  },
container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8, // Separación del encabezado
},
  label: {
  fontSize: 14,
  fontWeight: '600',
  color: colors.textPrimary,
  marginBottom: 8,
  marginTop: 20,
},

input: {
  backgroundColor: colors.surface,
  borderRadius: 12,
  paddingHorizontal: 16,
  paddingVertical: 12,
  fontSize: 15,

  // Borde sutil para definir el campo
  borderWidth: 1,
  borderColor: '#E5E7EB',
},

textArea: {
  backgroundColor: colors.surface,
  borderRadius: 12,
  paddingHorizontal: 16,
  paddingVertical: 12,
  fontSize: 15,
  height: 120,

  textAlignVertical: 'top',

  // Borde sutil para definir el campo
  borderWidth: 1,
  borderColor: '#E5E7EB',
},
});
