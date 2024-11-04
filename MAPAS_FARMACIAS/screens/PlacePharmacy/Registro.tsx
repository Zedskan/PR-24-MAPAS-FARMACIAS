import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const RegistroScreen = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false);
  const [errorUsername, setErrorUsername] = useState<string | null>(null);
  const [errorEmail, setErrorEmail] = useState<string | null>(null);
  const [errorPassword, setErrorPassword] = useState<string | null>(null);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState<string | null>(null);
  const navigation = useNavigation();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const validarContrasena = (password: string): string | null => {
    const regexMayuscula = /[A-Z]/;
    const regexMinuscula = /[a-z]/;
    const regexNumero = /\d/;
    const regexEspecial = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres.';
    }
    if (!regexMayuscula.test(password)) {
      return 'La contraseña debe contener al menos una letra mayúscula.';
    }
    if (!regexMinuscula.test(password)) {
      return 'La contraseña debe contener al menos una letra minúscula.';
    }
    if (!regexNumero.test(password)) {
      return 'La contraseña debe contener al menos un número.';
    }
    if (!regexEspecial.test(password)) {
      return 'La contraseña debe contener al menos un carácter especial.';
    }
    return null;
  };

  const emailExiste = (email: string): boolean => {
    return true;
  };

  const usernameExiste = (username: string): boolean => {
    return true;
  };

  const validarDominioEmail = (email: string): boolean => {
    const dominiosValidos = ['gmail.com', 'outlook.com', 'yahoo.com'];
    const dominioEmail = email.split('@')[1];
    return dominiosValidos.includes(dominioEmail);
  };

  const handleRegister = () => {
    setErrorUsername(null);
    setErrorEmail(null);
    setErrorPassword(null);
    setErrorConfirmPassword(null);

    if (username === '') {
      setErrorUsername('El nombre de usuario es obligatorio');
      return;
    }

    if (usernameExiste(username)) {
      setErrorUsername('El nombre de usuario ya está registrado');
      return;
    }

    if (email === '') {
      setErrorEmail('El correo electrónico es obligatorio');
      return;
    }

    if (emailExiste(email)) {
      setErrorEmail('El correo electrónico ya está registrado');
      return;
    }

    if (!validarDominioEmail(email)) {
      setErrorEmail('Correo electrónico no válido. Utiliza un dominio permitido como @gmail.com, @outlook.com, o @yahoo.com.');
      return;
    }

    const mensajeErrorContrasena = validarContrasena(password);
    if (mensajeErrorContrasena) {
      setErrorPassword(mensajeErrorContrasena);
      return;
    }

    if (password !== confirmPassword) {
      setErrorConfirmPassword('Las contraseñas no coinciden');
      return;
    }

    const newId = (1 + 1).toString();
    const newUser = {
      id: newId,
      username: username,
      email: email,
      password: password,
      role: 'propietario',
    };

   // users.push(newUser);

    Alert.alert('Éxito', 'Usuario registrado correctamente');
    
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Usuario</Text>

      <TextInput
        style={[styles.input, errorUsername ? styles.inputError : null]}
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
      />
      {errorUsername && <Text style={styles.errorText}>{errorUsername}</Text>}

      <TextInput
        style={[styles.input, errorEmail ? styles.inputError : null]}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      {errorEmail && <Text style={styles.errorText}>{errorEmail}</Text>}

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.inputPassword, errorPassword ? styles.inputError : null]}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <Icon name={isPasswordVisible ? 'eye' : 'eye-slash'} size={20} color="gray" />
        </TouchableOpacity>
      </View>
      {errorPassword && <Text style={styles.errorText}>{errorPassword}</Text>}

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.inputPassword, errorConfirmPassword ? styles.inputError : null]}
          placeholder="Repetir contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!isConfirmPasswordVisible}
        />
        <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.eyeIcon}>
          <Icon name={isConfirmPasswordVisible ? 'eye' : 'eye-slash'} size={20} color="gray" />
        </TouchableOpacity>
      </View>
      {errorConfirmPassword && <Text style={styles.errorText}>{errorConfirmPassword}</Text>}

      <Button title="Registrarse" onPress={handleRegister} />
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

export default RegistroScreen;
