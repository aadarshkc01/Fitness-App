import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { chatWithCoach } from '../controllers/coach.controller';

const router = Router();

router.post('/chat', authenticate, chatWithCoach);

export default router;
