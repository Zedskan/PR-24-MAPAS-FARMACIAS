import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router'; // Import useRouter
import ModaScreem from './components/ModaScreem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import {apiFetch} from "./(ApiRes)/apiConfig.js"


const LoginScreen = () => {
  const { onLogin } = useAuth();
  const router = useRouter(); // Initialize the router
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [mes, setMes] = useState<string>('');

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  const handleLogin = async () => {
    if (username === '' || password === '') {
      setLoginMessage('Todos los campos son obligatorios');
      return;
    }

    setModalVisible(true); // Show modal before the login request
    try {
      const user = await login(username, password);
      if (user) {
        if(user.status === 1){
    
              await AsyncStorage.setItem('user', JSON.stringify(user)); 
              console.info(user)
              //si es propietario sera solo un usuario mas
              if(user.role === "Propietario"){
                onLogin!("user", "user")
              }else if(user.role === "Administrador") {
                onLogin!("admin", "admin") 
              }
               
        }else{
          setMes("Su cuneta fue Deshabilitado")
        } 
      }


    } catch (error) {
      console.error("Login error:", error);
      setLoginMessage("Error en la conexión con el servidor.");
    } finally {
      setModalVisible(false); // Hide modal after the request is done
    }
  };



  const login = async (username: string, password: string) => {
    try {
      const data = await apiFetch("/UserLogin", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (data.user) {
        return data.user; 
      } else if (data.error) {
        setLoginMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setLoginMessage("Error en la conexión con el servidor.");
    }
    return null; // Return null if login fails
  };
 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sessión</Text>

      <TextInput
        style={[styles.input, loginMessage ? styles.inputError : null]}
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.inputPassword, loginMessage ? styles.inputError : null]}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <Icon name={isPasswordVisible ? 'eye' : 'eye-slash'} size={20} color="gray" />
        </TouchableOpacity>
      </View>

      {mes && <Text>{mes}</Text>}
      {loginMessage && <Text style={styles.errorText}>{loginMessage}</Text>}

      <Button title="Iniciar sesión" onPress={handleLogin} />

      <ModaScreem visible={modalVisible} onClose={handleCloseModal} />
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
