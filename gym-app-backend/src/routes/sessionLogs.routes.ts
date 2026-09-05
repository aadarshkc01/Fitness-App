import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { logSession, getSessionHistory } from '../controllers/sessionLogs.controller';

const router = Router();

router.post('/', authenticate, logSession);
router.get('/history/:planSessionId', authenticate, getSessionHistory);

export default router;