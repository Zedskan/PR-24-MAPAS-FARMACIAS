const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'redbull2019',
  database: 'pharmacymaps',
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL.');
});

const validarContrasena = (password) => {
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

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  const queryCheckEmail = 'SELECT * FROM users WHERE email = ?';
  db.query(queryCheckEmail, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al verificar el correo electrónico.' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }

    const mensajeErrorContrasena = validarContrasena(password);
    if (mensajeErrorContrasena) {
      return res.status(400).json({ message: mensajeErrorContrasena });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const role = 'propietario';

      const queryInsertUser = 'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)';
      db.query(queryInsertUser, [username, email, hashedPassword, role], (err, result) => {
        if (err) {
          console.error('Error al registrar el usuario:', err);
          return res.status(500).json({ message: 'Error al registrar el usuario.' });
        }
        res.status(201).json({ message: 'Usuario registrado correctamente.' });
      });
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

