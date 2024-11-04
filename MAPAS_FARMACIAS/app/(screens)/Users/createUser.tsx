import React, {useState} from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'expo-router';
import ModaScreem from '../../components/ModaScreem'
import {apiFetch} from '../../(ApiRes)/apiConfig'

const RegistrationForm: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const router = useRouter();
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Nombre es requerido'),
    lastName: Yup.string().required('Apellido es requerido'),
    numberPhone: Yup.string().required('Número de teléfono es requerido').matches(/^\d+$/, 'Debe ser un número válido'),
    nit: Yup.string().required('NIT es requerido'),
    email: Yup.string().email('Email no válido').required('Correo electrónico es requerido'),
  });
  const UserRegister = async (values: any) => {

    try {
        setModalVisible(true)
        
        const response = await apiFetch('/registerUser', {
          method: 'POST',
          body: JSON.stringify(values), // Enviar los valores en el cuerpo de la solicitud
        });

       if (response) {
        router.back();
         Alert.alert('Registro exitoso del Usuario', );
       } else {
         Alert.alert('Error', response.message);
       }

    } catch (error) {
      console.error('Error al registrar:', error);
      Alert.alert('Error', 'Error al registrar. Inténtalo más tarde.');
    }finally{
      setModalVisible(false)
    }

  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <>
    <Formik
      initialValues={{ name: '', lastName: '', numberPhone: '', nit: '', email: '' }}
      validationSchema={validationSchema}
      onSubmit={UserRegister}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Registro de Usuario</Text>

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

          <Button title="Registrar" onPress={() => handleSubmit()} />
        </View>
      )}

    </Formik>
    <ModaScreem visible={modalVisible} onClose={handleCloseModal} />
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

export default RegistrationForm;
