import pool from '../dbConfig.js';


export async function getRedSalud() {
    try {  
        const [rows] = await pool.query(
            `SELECT id, name FROM healthnetwork WHERE status = ?`,
            [1]
        );
        
        if (rows.length > 0) {
            console.log(rows);
            return rows;
        } else {
            console.log('No se encontraron Redes de Salud activas.');
            return []; 
        }
    } catch (e) {
        console.log('Error:', e.message);
        throw new Error('Error al recuperar red de salud: ' + e.message);
    }
}