import bcrypt from 'bcrypt';
import db from '../models/index.js'; 

export async function createUser(name, email, password, role = 'user') {
  const hash = await bcrypt.hash(password, 10);
  const result = await db.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, email, hash, role]
  );
  return result.rows[0];
}

export async function findUserByEmail(email) {
  const result = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
  return result.rows[0];
}

export async function getUserReviews(userId) {
  const result = await db.query(
    `SELECT reviews.id, reviews.content, vehicles.make || ' ' || vehicles.model AS vehicle_name
     FROM reviews
     JOIN vehicles ON reviews.vehicle_id = vehicles.id
     WHERE reviews.user_id = $1`, [userId]
  );
  return result.rows;
}

export async function getUserRepairs(userId) {
  const result = await db.query(
    `SELECT repairs.id, repairs.description, repairs.status, vehicles.make || ' ' || vehicles.model AS vehicle_name
     FROM repairs
     JOIN vehicles ON repairs.vehicle_id = vehicles.id
     WHERE repairs.user_id = $1`, [userId]
  );
  return result.rows;
}
