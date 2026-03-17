import { Router } from 'express';
import healthRoutes from './health.routes.js';
import userRoutes from './user.route.js';
import contentRoutes from './content.route.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/users', userRoutes);
router.use('/content', contentRoutes);

export default router;
