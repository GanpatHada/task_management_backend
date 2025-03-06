import { pool } from "../config/db.config";

export const createUserTable = async (): Promise<void> => {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
  
    try {
      await pool.query(query);
      console.log('✅ users table created or already exists');
    } catch (error) {
      console.error('❌ Error creating users table:', error);
    }
  };