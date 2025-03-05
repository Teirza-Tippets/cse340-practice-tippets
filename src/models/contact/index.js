import dbPromise from '../../database/index.js';

const storeUserMessage = async (name, email, message) => {
    const db = await dbPromise;
    const query = 'INSERT INTO contact (name, email, message) VALUES (?, ?, ?)';
    return await db.run(query, name, email, message);
}

export { storeUserMessage };