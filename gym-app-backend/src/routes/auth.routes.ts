import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { signup, login, oauthExchange, logout, logoutAll, getMe, deleteAccount } from '../controllers/auth.controller';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/oauth-exchange', oauthExchange);
router.post('/logout', authenticate, logout);
router.post('/logout-all', authenticate, logoutAll);
router.get('/me', authenticate, getMe);
router.delete('/delete-account', authenticate, deleteAccount);

export default router;
