import pool from '../dbConfig.js';

export async function getTyPharmacy() {
    try {
      
        const [rows] = await pool.query(
            `SELECT id, name FROM typepharmacy WHERE status = ?`,
            [1]
        );

        
        if (rows.length > 0) {
            console.log(rows);
            return rows;
        } else {
            console.log('No se encontraron types activas.');
            return []; 
        }
    } catch (e) {
        console.log('Error:', e.message);
        throw new Error('Error al recuperar types: ' + e.message);
    }
}
