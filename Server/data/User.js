import pool from '../dbConfig.js'
import crypto from 'crypto';
import nodemailer from "nodemailer"


export async function getPropietarios() {
    try {
        // Realiza la consulta para obtener usuarios con rol "Propietario"
        const [rows] = await pool.query(
            'SELECT u.id, u.userName, p.name, p.lastName, p.numberPhone, p.nit, p.email, u.role, u.status ' +
            'FROM user u ' +
            'INNER JOIN person p ON u.id = p.id ' +
            'WHERE u.role = ? AND (u.status = 1 OR u.status = 2)' ,
            ['Propietario'] // Filtrar por rol "Propietario"
        );

        // Si hay resultados, los devuelve; si no, devuelve un mensaje
        if (rows.length > 0) {
            console.log(rows); // Muestra los resultados en la consola
            return rows; // Devuelve la lista de usuarios
        } else {
            console.log('No se encontraron usuarios con rol "Propietario".');
            return []; // Devuelve un arreglo vacío si no hay usuarios
        }
    } catch (e) {
        console.log('Error:', e.message); // Mostrar el mensaje de error en caso de que ocurra
        throw new Error('Error al recuperar usuarios: ' + e.message); // Lanza un error con mensaje detallado
    }
}


const generatePassword = () => {
    const plainPassword = Math.random().toString(36).slice(-8); // Genera una contraseña aleatoria de 8 caracteres
    console.log("Contraseña sin cifrar:", plainPassword);
 
    const hashedPassword = crypto.createHash('sha256').update(plainPassword).digest('hex');
    console.log("Contraseña cifrada:", hashedPassword);
 
    return { plainPassword, hashedPassword }; // Devuelve ambas versiones
 };

const generateUserName = (nit, name, lastName) => {
    // Usar la primera letra del nombre, el apellido completo y los últimos 4 dígitos del NIT
    const lastFourDigitsNit = nit.slice(-4); // Obtener los últimos 4 dígitos del NIT
    const userName = `${name.charAt(0).toLowerCase()}${lastName.toLowerCase()}${lastFourDigitsNit}`; // Ejemplo: "bsejas2355"

    return userName; // Devuelve el nombre de usuario generado
};


export async function registerPersonAndUser(personData) {
    const connection = await pool.getConnection(); // Obtener una conexión del pool
    try {
        await connection.beginTransaction(); // Iniciar una transacción

        const { plainPassword, hashedPassword } = generatePassword();
        const userData = { userName: generateUserName(personData.nit, personData.name, personData.lastName ), password: hashedPassword, role: "Propietario" };

        console.log("desde adentro: ",userData, personData )
         // Insertar la persona
         const [result] = await connection.query(
             'INSERT INTO person (name, lastName, numberPhone, nit, email) VALUES (?, ?, ?, ?, ?)',
             [personData.name, personData.lastName, personData.numberPhone, personData.nit, personData.email]
         );

        // Obtener el ID de la persona insertada
         const personId = result.insertId; // `insertId` es el ID de la nueva persona

         await connection.query(
             'INSERT INTO user (id, userName, password, role) VALUES (?, ?, ?, ?)',
             [personId, userData.userName, userData.password, userData.role]
         );

         await sendCredentialsEmail(personData.email, userData.userName, plainPassword);

         await connection.commit();
         console.log('Registro exitoso:', personData, userData);
         return { message: 'Registro exitoso' };
    } catch (error) {
        await connection.rollback(); // Revertir la transacción en caso de error
        console.error('Error al registrar:', error.message);
        throw new Error('Error al registrar persona y usuario: ' + error.message);
    } finally {
        connection.release();
    }
}

// Configura el transportador de correo--------------------------
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'jhaelkuno345@gmail.com',
        pass: 'lkgd oqrs hdvl xnsu'
    }
});
const sendCredentialsEmail = async (email, userName, password) => {
    try {
        const info = await transporter.sendMail({
            from: '"Soporte" farmaciaCenter@gmail.com',
            to: email,
            subject: 'Credenciales de Acceso',
            text: `Hola, aquí tienes tus credenciales de acceso:
            Usuario: ${userName}
            Contraseña: ${password}`,
            html: `<p>Hola,</p>
            <p>Aquí tienes tus credenciales de acceso:</p>
            <ul>
                <li><strong>Usuario:</strong> ${userName}</li>
                <li><strong>Contraseña:</strong> ${password}</li>
            </ul>
            <p>Por favor, cambia tu contraseña después de iniciar sesión.</p>`
        });

        console.log('Correo enviado:', info.messageId);
        return { message: 'Correo enviado exitosamente' };
    } catch (error) {
        console.error('Error al enviar el correo:', error.message);
        throw new Error('Error al enviar correo: ' + error.message);
    }
};




export async function getUsuarioById(id) {
    try {
        const [rows] = await pool.query(
            'SELECT u.id, u.userName, p.name, p.lastName, p.numberPhone, p.nit, p.email, u.role, u.status ' +
            'FROM user u ' +
            'INNER JOIN person p ON u.id = p.id ' +
            'WHERE u.id = ?',
            [id]
        );

        if (rows.length > 0) {
            console.log(rows[0]); // Muestra el resultado en la consola
            return rows[0]; // Devuelve el usuario
        } else {
            console.log(`No se encontró un usuario con ID ${id}.`);
            return null; // Devuelve null si no se encuentra el usuario
        }
    } catch (e) {
        console.log('Error:', e.message);
        throw new Error('Error al recuperar el usuario: ' + e.message);
    }
}




export async function updateUsuarioById(id, userData) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Actualiza los datos en la tabla "person"
        await connection.query(
            'UPDATE person SET name = ?, lastName = ?, numberPhone = ?, nit = ?, email = ? WHERE id = ?',
            [userData.name, userData.lastName, userData.numberPhone, userData.nit, userData.email, id]
        );

        await connection.commit();
        console.log(`Usuario con ID ${id} actualizado exitosamente.`);
        return { message: 'Usuario actualizado exitosamente' };
    } catch (error) {
        await connection.rollback();
        console.error('Error al actualizar el usuario:', error.message);
        throw new Error('Error al actualizar el usuario: ' + error.message);
    } finally {
        connection.release();
    }
}




export async function deleteUser(id) {
    try {
        // Realiza la consulta para obtener farmacias activas
        const [rows] = await pool.query(
            `UPDATE user SET status = 2 WHERE id = ? `,
            [id] 
        );

        if (rows.length > 0) {
            console.log(rows);
            return rows;
        } else {
            console.log('No se pudo eliminar');
            return []; // Devuelve un arreglo vacío si no hay farmacias
        }
    } catch (e) {
        console.log('Error:', e.message); // Mostrar el mensaje de error en caso de que ocurra
        throw new Error('Error al desavilitar al Usuario: ' + e.message); // Lanza un error con mensaje detallado
    }
}

export async function UserAvilittar(id) {
    try {
        // Realiza la consulta para obtener farmacias activas
        const [rows] = await pool.query(
            `UPDATE user SET status = 1 WHERE id = ? `,
            [id] 
        );

        if (rows.length > 0) {
            console.log(rows);
            return rows;
        } else {
            console.log('No se pudo avilitar');
            return []; // Devuelve un arreglo vacío si no hay farmacias
        }
    } catch (e) {
        console.log('Error:', e.message); // Mostrar el mensaje de error en caso de que ocurra
        throw new Error('Error al avilitar al Usuario: ' + e.message); // Lanza un error con mensaje detallado
    }
}