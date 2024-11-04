import pool from '../dbConfig.js';
import crypto from 'crypto';






const hashString = (str) => {
  return crypto.createHash('sha256').update(str).digest('hex');
};




export async function UserLogin(username, inputPassword) {
  try {
    const [rows] = await pool.query(
      'SELECT u.id, u.userName, u.password, u.role, u.firstLogin, u.status, p.email, p.name, p.lastName FROM user u INNER JOIN  person p ON u.id = p.id WHERE userName = ?', 
      [username]
    );

    if (rows.length > 0) {
      const user = rows[0];
      console.log(user);  
      const hashedPassword = hashString(inputPassword);
      const isPasswordCorrect = hashedPassword === user.password;
      console.log(isPasswordCorrect);

      if (isPasswordCorrect) {
        return { message: 'Inicio de sesión exitoso', user };
      } else {
        console.log('Contraseña incorrecta. Intenta de nuevo.');
        return { error: 'Contraseña incorrecta. Intenta de nuevo.' };
      }
    } else {   
      return { error: 'Usuario no encontrado. Asegúrate de que el nombre de usuario sea correcto.' };
    }

  } catch (e) {
    console.log('Error:', e.message);
    return { error: 'Error en el servidor: ' + e.message }; // Mensaje de error del servidor
  }
}



export async function changeUsernameAndPassword(id, username, inputPassword) {
  try {
    const hashedPassword = hashString(inputPassword);

    const [result] = await pool.query(
      'UPDATE user SET userName = ? , password = ?, firstLogin = 2  WHERE id = ?', 
      [username, hashedPassword, id]
    );

    if (result.affectedRows > 0) {
      console.log('Nombre de usuario y contraseña actualizados correctamente');
      return { success: true };
    } else {
      console.log('Usuario no encontrado');
      return { error: 'Usuario no encontrado' };
    }
    

  } catch (e) {
    console.log('Error:', e.message);
    return { error: 'Error en el servidor: ' + e.message };
  }
}



//UserLogin("BOR","Bo")

