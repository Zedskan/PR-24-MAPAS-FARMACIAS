import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { users } from './UserData';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [identifier, setIdentifier] = useState<string>(''); // Para nombre de usuario o email
  const [password, setPassword] = useState<string>('');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigation = useNavigation();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = () => {
    setErrorMessage(null);

    if (identifier === '' || password === '') {
      setErrorMessage('Todos los campos son obligatorios');
      return;
    }

    const user = users.find(
      user => (user.username === identifier || user.email === identifier) && user.password === password
    );

    if (user) {
      Alert.alert('Bienvenido', `Bienvenido, ${user.username}!`);
      setIdentifier('');
      setPassword('');

    } else {
      setErrorMessage('Nombre de usuario, correo o contraseña incorrectos');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>

      <TextInput
        style={[styles.input, errorMessage ? styles.inputError : null]}
        placeholder="Nombre de usuario o correo electrónico"
        value={identifier}
        onChangeText={setIdentifier}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.inputPassword, errorMessage ? styles.inputError : null]}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <Icon name={isPasswordVisible ? 'eye' : 'eye-slash'} size={20} color="gray" />
        </TouchableOpacity>
      </View>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <Button title="Iniciar sesión" onPress={handleLogin} />
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
  inputPassword: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    padding: 5,
    height: '100%',
    justifyContent: 'center',
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

export default LoginScreen;
