import dotenv from 'dotenv';
import { query } from '../config/db.js';

dotenv.config();

const createContentTable = async () => {
  try {
    await query(`
      ALTER TABLE content
      ADD COLUMN IF NOT EXISTS image VARCHAR(255)
    `);
    console.log('Column "image" added to "content" table successfully (or already exists).');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
};

createContentTable();