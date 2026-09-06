import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { updateProfile } from '../controllers/profile.controller';

const router = Router();

router.patch('/', authenticate, updateProfile);

export default router;
