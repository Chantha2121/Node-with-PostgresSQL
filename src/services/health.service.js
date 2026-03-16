import { query } from '../../config/db.js';

export const checkDatabase = async () => {
  const result = await query('SELECT NOW() AS now');

  return {
    connected: true,
    serverTime: result.rows[0].now,
  };
};
