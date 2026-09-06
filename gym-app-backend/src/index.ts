import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db/connection';
import authRoutes from './routes/auth.routes';
import intakeRoutes from './routes/intake.routes';
import exercisesRoutes from './routes/exercises.routes';
import plansRoutes from './routes/plans.routes';
import sessionLogsRoutes from './routes/sessionLogs.routes';
import profileRoutes from './routes/profile.routes';
import coachRoutes from './routes/coach.routes';
import { authenticate, authorize } from './middleware/auth.middleware';
import { errorHandler } from './middleware/errorHandler.middleware';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/intake', intakeRoutes);
app.use('/exercises', exercisesRoutes);
app.use('/plans', plansRoutes);
app.use('/session-logs', sessionLogsRoutes);
app.use('/profile', profileRoutes);
app.use('/coach', coachRoutes);

app.get('/admin/ping', authenticate, authorize('super_admin'), (_req, res) => {
  res.json({ message: 'You are a super_admin. This route is protected correctly.' });
});

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
