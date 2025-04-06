import dbClient from '../models/index.js'

const getAllVehicles = async () => {
  const db = await dbClient;
  const sql = 'SELECT * FROM  vehicles';
  const result = await db.query(sql);
  return result.rows;
}


const getClassVehicles = async (vehicleClass) => {
  const db = await dbClient;
  const sql = 'SELECT * FROM  vehicles WHERE category_id = $1';
  const result = await db.query(sql, [vehicleClass]);
  return result.rows;
}

export {getAllVehicles, getClassVehicles};