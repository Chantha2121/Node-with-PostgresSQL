import { checkDatabase } from '../services/health.service.js';

export const getApiHealth = async (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'api',
  });
};

export const getDatabaseHealth = async (req, res) => {
  try {
    const dbHealth = await checkDatabase();

    res.status(200).json({
      status: 'ok',
      service: 'database',
      data: dbHealth,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      service: 'database',
      message: error.message,
    });
  }
};
