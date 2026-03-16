import dotenv from 'dotenv';
import app from './src/app.js';
import { testDbConnection } from './config/db.js';

dotenv.config();

const PORT = Number(process.env.PORT || 3000);

const startServer = async () => {
  await testDbConnection();

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});