import { pool } from './db.js';

export async function getAllVehicles() {
  const result = await pool.query('SELECT * FROM vehicles ORDER BY created_at DESC');
  return result.rows;
}

export async function getVehicleById(id) {
  const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
  return result.rows[0];
}


