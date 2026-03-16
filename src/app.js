import express from 'express';
import apiRoutes from './routes/index.js';

const app = express();

app.use(express.json());
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Node API is running',
  });
});

export default app;
