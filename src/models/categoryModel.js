import dbClient from '../models/index.js'

const getAllCategories = async () => {
    const db = await dbClient;
    const sql = 'SELECT * FROM  categories';
    const result = await db.query(sql);
    return result.rows;
}

export {getAllCategories};