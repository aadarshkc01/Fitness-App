import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { saveIntake, getMyIntake } from '../controllers/intake.controller';

const router = Router();

router.post('/', authenticate, saveIntake);
router.get('/me', authenticate, getMyIntake);

export default router;