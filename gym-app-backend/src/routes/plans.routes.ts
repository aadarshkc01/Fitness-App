import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { generatePlan, getMyPlan } from '../controllers/plans.controller';

const router = Router();

router.post('/generate', authenticate, generatePlan);
router.get('/me', authenticate, getMyPlan);

export default router;