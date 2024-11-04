import pool from '../dbConfig.js';

export async function getFarmacias() {
    try {
        // Realiza la consulta para obtener farmacias activas
        const [rows] = await pool.query(
            `SELECT 
                p.id,
                p.name,
                p.address,
                p.latitude,
                p.longitude,
                p.phone,
                p.codeZona,
                p.status,
                s.name AS sectorName,
                tp.name AS typePharmacy,
                z.name AS zonaName,
                hn.name AS healthNetwork,
                t.name AS townName,
                u.userName AS userName,
                pe.name AS personName,
                pe.lastName AS personLastName
            FROM pharmacy p
            INNER JOIN sector s ON p.idSector = s.id
            INNER JOIN typepharmacy tp ON p.idTypePharmacy = tp.id
            INNER JOIN zona z ON p.idZona = z.id
            INNER JOIN healthnetwork hn ON p.idHealthNetwork = hn.id
            INNER JOIN town t ON z.idTown = t.id
            INNER JOIN user u ON p.idUser = u.id
            INNER JOIN person pe ON pe.id = u.id
            WHERE p.status = ? `,
            [1] 
        );

        if (rows.length > 0) {
            console.log(rows);
            return rows;
        } else {
            console.log('No se encontraron farmacias activas.');
            return []; // Devuelve un arreglo vacío si no hay farmacias
        }
    } catch (e) {
        console.log('Error:', e.message); // Mostrar el mensaje de error en caso de que ocurra
        throw new Error('Error al recuperar farmacias: ' + e.message); // Lanza un error con mensaje detallado
    }
}




export async function getFarmaciasByIdUser(id, role) {
    try {
        let query;
        let params = [1]; // El primer parámetro es siempre el estado de las farmacias

        // Determinar la consulta SQL y los parámetros según el rol
        if (role == "Administrador") {
            // Si es Administrador, recuperar todas las farmacias activas
            query = `
                SELECT 
                    p.id,
                    p.name,
                    p.address,
                    p.latitude,
                    p.longitude,
                    p.phone,
                    p.codeZona,
                    p.status,
                    s.name AS sectorName,
                    tp.name AS typePharmacy,
                    z.name AS zonaName,
                    hn.name AS healthNetwork,
                    t.name AS townName,
                    u.userName AS userName,
                    pe.name AS personName,
                    pe.lastName AS personLastName
                FROM pharmacy p
                INNER JOIN sector s ON p.idSector = s.id
                INNER JOIN typepharmacy tp ON p.idTypePharmacy = tp.id
                INNER JOIN zona z ON p.idZona = z.id
                INNER JOIN healthnetwork hn ON p.idHealthNetwork = hn.id
                INNER JOIN town t ON z.idTown = t.id
                INNER JOIN user u ON p.idUser = u.id
                INNER JOIN person pe ON pe.id = u.id
                WHERE p.status = ?`; // Sin filtro por ID
        } else {
            // Si es Propietario, recuperar solo las farmacias del usuario específico
            query = `
                SELECT 
                    p.id,
                    p.name,
                    p.address,
                    p.latitude,
                    p.longitude,
                    p.phone,
                    p.codeZona,
                    p.status,
                    s.name AS sectorName,
                    tp.name AS typePharmacy,
                    z.name AS zonaName,
                    hn.name AS healthNetwork,
                    t.name AS townName,
                    u.userName AS userName,
                    pe.name AS personName,
                    pe.lastName AS personLastName
                FROM pharmacy p
                INNER JOIN sector s ON p.idSector = s.id
                INNER JOIN typepharmacy tp ON p.idTypePharmacy = tp.id
                INNER JOIN zona z ON p.idZona = z.id
                INNER JOIN healthnetwork hn ON p.idHealthNetwork = hn.id
                INNER JOIN town t ON z.idTown = t.id
                INNER JOIN user u ON p.idUser = u.id
                INNER JOIN person pe ON pe.id = u.id
                WHERE p.status = ? AND u.id = ?`; // Filtro por ID de usuario
            params.push(id); // Agregar el id a los parámetros
        }

        // Realiza la consulta para obtener farmacias activas
        const [rows] = await pool.query(query, params);

        if (rows.length > 0) {
            console.log(rows);
            return rows;
        } else {
            console.log('No se encontraron farmacias activas de este Usuario');
            return []; // Devuelve un arreglo vacío si no hay farmacias
        }
    } catch (e) {
        console.log('Error:', e.message); // Mostrar el mensaje de error en caso de que ocurra
        throw new Error('Error al recuperar farmacias: ' + e.message); // Lanza un error con mensaje detallado
    }
}



export async function registerFarmacia(farmaciaData) {
    const {name, address, latitude, longitude, phone, codeZona, idSector, idTypePharmacy, idZona, idHealthNetwork, idUser} = farmaciaData;

    try {
        // Realiza la consulta para insertar una nueva farmacia
        const [result] = await pool.query(
            `INSERT INTO pharmacy (name,  address,  latitude,  longitude,  phone,  codeZona,  idSector,  idTypePharmacy,  idZona,  idHealthNetwork, idUser
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name,
                address,
                latitude,
                longitude,
                phone,
                codeZona,
                idSector,
                idTypePharmacy,
                idZona,
                idHealthNetwork,
                idUser
            ]
        );

        // Verifica si se insertó alguna fila
        if (result.affectedRows === 1) {
            console.log('Farmacia registrada exitosamente.');
            return { message: 'Farmacia registrada exitosamente.' };
        } else {
            throw new Error('Error al registrar la farmacia.');
        }
    } catch (e) {
        console.log('Error:', e.message);
        throw new Error('Error al registrar la farmacia: ' + e.message);
    }
}



export async function getFarmaciasById(id) {
    try {
        // Realiza la consulta para obtener farmacias activas
        const [rows] = await pool.query(
            `SELECT * FROM pharmacy WHERE id = ? `,
            [id] 
        );

        if (rows.length > 0) {
            console.log(rows);
            return rows;
        } else {
            console.log('No se encontraron farmacias activas.');
            return []; // Devuelve un arreglo vacío si no hay farmacias
        }
    } catch (e) {
        console.log('Error:', e.message); // Mostrar el mensaje de error en caso de que ocurra
        throw new Error('Error al recuperar farmacias: ' + e.message); // Lanza un error con mensaje detallado
    }
}



export async function deletePharmacy(id) {
    try {
        // Realiza la consulta para obtener farmacias activas
        const [rows] = await pool.query(
            `UPDATE pharmacy SET status = 0 WHERE id = ? `,
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
        throw new Error('Error al eliminar farmacias: ' + e.message); // Lanza un error con mensaje detallado
    }
}






export async function updateFarmacia(farmaciaData) {
    const { id, name, address, latitude, longitude, phone, codeZona, idSector, idTypePharmacy, idZona, idHealthNetwork, idUser } = farmaciaData;

    try {
        console.log("los datos de mi ",farmaciaData)
         // Realiza la consulta para actualizar una farmacia existente
         const [result] = await pool.query(
             `UPDATE pharmacy SET 
                 name = ?, 
                 address = ?, 
                 latitude = ?, 
                 longitude = ?, 
                 phone = ?, 
                 codeZona = ?, 
                 idSector = ?, 
                 idTypePharmacy = ?, 
                 idZona = ?, 
                 idHealthNetwork = ?, 
                 idUser = ?
             WHERE id = ?`,
             [
                 name,
                 address,
                 latitude,
                 longitude,
                 phone,
                 codeZona,
                 idSector,
                 idTypePharmacy,
                 idZona,
                 idHealthNetwork,
                 idUser,
                 id // ID de la farmacia que se desea actualizar
             ]
         )
         // Verifica si se actualizó alguna fila
         if (result.affectedRows === 1) {
             console.log('Farmacia actualizada exitosamente.');
             return { message: 'Farmacia actualizada exitosamente.' };
         } else {
             throw new Error('No se encontró la farmacia o no se realizaron cambios.');
         }
    } catch (e) {
        console.log('Error:', e.message);
        throw new Error('Error al actualizar la farmacia: ' + e.message);
    }
}
