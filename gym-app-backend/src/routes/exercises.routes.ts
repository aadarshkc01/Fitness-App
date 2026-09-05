import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { listExercises } from '../controllers/exercises.controller';

const router = Router();

router.get('/', authenticate, listExercises);

export default router;