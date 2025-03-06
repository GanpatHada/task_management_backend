import { pool } from "../config/db.config";

export const createTaskTable = async (): Promise<void> => {
    const query = `
    CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    task_title TEXT NOT NULL,
    task_description TEXT NOT NULL,
    task_due_date TIMESTAMP NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
    `;
  
    try {
      await pool.query(query);
      console.log('✅ tasks table created or already exists');
    } catch (error) {
      console.error('❌ Error creating tasks table:', error);
    }
  };