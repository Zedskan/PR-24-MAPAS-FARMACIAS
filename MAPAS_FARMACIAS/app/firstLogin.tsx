import React from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { apiFetch } from './(ApiRes)/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface FormData {
  userName: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangeCredentialsScreen: React.FC = () => {
  const router = useRouter(); // Initialize the router
  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const newPassword = watch('newPassword');



  const onSubmit = async (data: FormData) => {
    try {
      // Obtener el usuario almacenado en AsyncStorage
      const storedUserString = await AsyncStorage.getItem('user');
      const storedUser = storedUserString ? JSON.parse(storedUserString) : null;
  
      if (!storedUser || !storedUser.id) {
        console.error("No se encontró el usuario almacenado o el ID es inválido");
        return null;
      }
  
      const id = storedUser.id;
  
      // Llamada a la API para actualizar las credenciales
      const response = await apiFetch("/changeCredentials", {
        method: "POST",
        body: JSON.stringify({
          id,
          userName: data.userName,
          password: data.newPassword,
        }),
      });
  
      if (response) {
        console.info("Nombre de usuario y contraseña actualizados correctamente");
        router.replace('/login')
        alert("Nombre de usuario y contraseña actualizados correctamente, por favor inicie sesión nuevamente.")
        return data;
      } else {
        console.error("Error en la actualización:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      return null;
    }
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cambiar Usuario y Contraseña</Text>

      {/* Campo de usuario */}
      <Controller
        control={control}
        name="userName"
        rules={{
          required: 'El nombre de usuario es requerido',
          minLength: { value: 3, message: 'El nombre de usuario debe tener al menos 3 caracteres' },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.userName && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Nombre de usuario"
          />
        )}
      />
      {errors.userName && <Text style={styles.errorText}>{errors.userName.message}</Text>}

      {/* Campo de nueva contraseña */}
      <Controller
        control={control}
        name="newPassword"
        rules={{
          required: 'La nueva contraseña es requerida',
          minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.newPassword && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Nueva contraseña"
            secureTextEntry
          />
        )}
      />
      {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword.message}</Text>}

      {/* Campo de confirmación de contraseña */}
      <Controller
        control={control}
        name="confirmPassword"
        rules={{
          required: 'La confirmación de la contraseña es requerida',
          validate: (value) =>
            value === newPassword || 'Las contraseñas no coinciden',
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.confirmPassword && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Confirmar contraseña"
            secureTextEntry
          />
        )}
      />
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}

      {/* Botón de envío */}
      <Button title="Actualizar Credenciales" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 12,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ChangeCredentialsScreen;
