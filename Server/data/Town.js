import pool from '../dbConfig.js';

export async function getTown() {
    try {
        const [rows] = await pool.query(
            `SELECT id, name FROM town WHERE status = ?`,
            [1]
        );        
        if (rows.length > 0) {
            console.log(rows);
            return rows;
        } else {
            console.log('No se encontraron Localidades activas.');
            return []; 
        }
    } catch (e) {
        console.log('Error:', e.message);
        throw new Error('Error al recuperar Localidades: ' + e.message);
    }
}
