import bcrypt from 'bcrypt';
import dbClient from '../models/index.js'; 

export async function createUser(name, email, password, role = 'user') {
  const hash = await bcrypt.hash(password, 10);
  const result = await  dbClient.query(
    `INSERT INTO users (username, email, password, role)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, email, hash, role]
  );
  return result.rows[0];
}

export async function findUserByEmail(email) {
  const result = await  dbClient.query(`SELECT * FROM users WHERE email = $1`, [email]);
  return result.rows[0];
}

export async function getUserReviews(userId) {
  const result = await dbClient.query(
    `SELECT reviews.id, reviews.rating, reviews.content, vehicles.make || ' ' || vehicles.model AS vehicle_name
     FROM reviews
     JOIN vehicles ON reviews.vehicle_id = vehicles.id
     WHERE reviews.user_id = $1`, [userId]
  );
  return result.rows;
}

export async function getUserRepairs(userId) {
  const result = await dbClient.query(
    `SELECT repairs.id, repairs.status, repairs.notes, vehicles.make || ' ' || vehicles.model AS vehicle_name
     FROM repairs
     JOIN vehicles ON repairs.vehicle_id = vehicles.id
     WHERE repairs.user_id = $1`, [userId]
  );
  return result.rows;
}

export async function createReview(userId, vehicleId, rating, content) {
  const result = await dbClient.query(
    `INSERT INTO reviews (user_id, vehicle_id, rating, content, created_at)
     VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
    [userId, vehicleId, rating, content]
  );
  return result.rows[0]; 
}

export async function createRepair(userId, vehicleId, status, notes) {
  const result = await dbClient.query(
    `INSERT INTO repairs (user_id, vehicle_id, status, notes, updated_at)
     VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
    [userId, vehicleId, status, notes]
  );
  return result.rows[0];  
}
