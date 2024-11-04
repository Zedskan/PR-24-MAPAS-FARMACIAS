import pool from '../dbConfig.js';

export async function getSector() {
    try {
      
        const [rows] = await pool.query(
            `SELECT id, name FROM sector WHERE status = ?`,
            [1]
        );

        
        if (rows.length > 0) {
            console.log(rows);
            return rows;
        } else {
            console.log('No se encontraron Sectores activas.');
            return []; 
        }
    } catch (e) {
        console.log('Error:', e.message);
        throw new Error('Error al recuperar Sectores: ' + e.message);
    }
}
