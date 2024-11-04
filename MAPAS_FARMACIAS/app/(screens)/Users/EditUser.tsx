import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useLocalSearchParams, useRouter  } from 'expo-router';
import ModalScreen from '../../components/ModaScreem';
import { apiFetch } from '../../(ApiRes)/apiConfig.js';
type User = {
  id: number
  name: string;
  lastName: string;
  numberPhone: string;
  nit: string;
  email: string;
};

interface EditUserProps {
  user: User; // Asegúrate de recibir los datos del usuario a editar
}

const EditUser: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const router = useRouter();

  const { user } = useLocalSearchParams();
  // Convierte el parámetro `user` en un objeto JSON o un objeto vacío como fallback
  const selectedUser: User = user ? JSON.parse(user as string) : {
    id: 0, 
    name: '',
    lastName: '',
    numberPhone: '',
    nit: '',
    email: ''
  };




  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Nombre es requerido'),
    lastName: Yup.string().required('Apellido es requerido'),
    numberPhone: Yup.string().required('Número de teléfono es requerido').matches(/^\d+$/, 'Debe ser un número válido'),
    nit: Yup.string().required('NIT es requerido'),
    email: Yup.string().email('Email no válido').required('Correo electrónico es requerido'),
  });

  const UserUpdate = async (values: User) => {
    try {
      setModalVisible(true);
        const response = await apiFetch(`/updateUser/${selectedUser.id}`, {
          method: 'PUT',
          body: JSON.stringify(values), // Enviar los valores en el cuerpo de la solicitud
        });

      if (response) {
        Alert.alert('Usuario actualizado exitosamente');
        router.back();
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      Alert.alert('Error', 'Error al actualizar. Inténtalo más tarde.');
    } finally {
      setModalVisible(false);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Formik
        initialValues={selectedUser} // Usa los valores del usuario recibido como iniciales
        validationSchema={validationSchema}
        onSubmit={UserUpdate}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <View style={styles.container}>
            <Text style={styles.title}>Editar Usuario</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre"
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
            />
            {errors.name && <Text style={styles.error}>{errors.name}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Apellido"
              onChangeText={handleChange('lastName')}
              onBlur={handleBlur('lastName')}
              value={values.lastName}
            />
            {errors.lastName && <Text style={styles.error}>{errors.lastName}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Número de Teléfono"
              keyboardType="phone-pad"
              onChangeText={handleChange('numberPhone')}
              onBlur={handleBlur('numberPhone')}
              value={values.numberPhone}
            />
            {errors.numberPhone && <Text style={styles.error}>{errors.numberPhone}</Text>}

            <TextInput
              style={styles.input}
              placeholder="NIT"
              onChangeText={handleChange('nit')}
              onBlur={handleBlur('nit')}
              value={values.nit}
            />
            {errors.nit && <Text style={styles.error}>{errors.nit}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Correo Electrónico"
              keyboardType="email-address"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <Button title="Actualizar" onPress={() => handleSubmit()} />
          </View>
        )}
      </Formik>
      <ModalScreen visible={modalVisible} onClose={handleCloseModal} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
});

export default EditUser;
