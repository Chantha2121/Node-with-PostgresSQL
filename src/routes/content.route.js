import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { getAllContent, uploadContent } from '../controllers/content.controller.js';

const router = Router();

router.get('/', getAllContent);
router.post('/upload', authenticate, upload.single('image'), uploadContent);

export default router;
