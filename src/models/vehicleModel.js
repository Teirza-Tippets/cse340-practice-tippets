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

const getVehicleById = async (id) => {
  const db = await dbClient;
  const sql = 'SELECT * FROM vehicles WHERE id = $1';
  const result = await db.query(sql, [id]);
  return result.rows[0]; // returns a single vehicle
};


const getVehiclesByCategory = async (categoryId) => {
  const db = await dbClient;
  const sql = 'SELECT * FROM vehicles WHERE category_id = $1';
  const result = await db.query(sql, [categoryId]);
  return result.rows;
};

const getRandomVehicles = async (count = 3) => {
  const db = await dbClient;
  const sql = `SELECT * FROM vehicles ORDER BY RANDOM() LIMIT $1`;
  const result = await db.query(sql, [count]);
  return result.rows;
};

export { getVehiclesByCategory };

export {getAllVehicles, getClassVehicles, getVehicleById, getRandomVehicles};