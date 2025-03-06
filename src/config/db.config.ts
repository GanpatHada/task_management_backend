import { Pool } from "pg";
import { createUserTable } from "../models/user.model";
import { createTaskTable } from "../models/task.model";

export const pool = new Pool({
  connectionString: process.env.POSTGRE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function connectDB() {
  try {
    await pool.connect();
    createUserTable();
    createTaskTable();
  } catch (error) {
    throw error;
  }
}
