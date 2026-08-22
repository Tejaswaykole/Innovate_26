import { Router } from 'express';

import participantRoutes from './participant.routes';
import teamRoutes from './team.routes';
import submissionRoutes from './submission.routes';
import judgeRoutes from './judge.routes';
import evaluationRoutes from './evaluation.routes';
import adminRoutes from './admin.routes';
import publicRoutes from './public.routes';
import { successResponse } from '../utils/response';

const router = Router();

// Health check endpoint on API v1
router.get('/health', (req, res) => {
  res.json(successResponse({ status: 'ok', timestamp: new Date().toISOString() }));
});

// Mount modular routes

router.use('/participant', participantRoutes);
router.use('/team', teamRoutes);
router.use('/submission', submissionRoutes);
router.use('/judge', judgeRoutes);
router.use('/evaluation', evaluationRoutes);
router.use('/admin', adminRoutes);
router.use('/public', publicRoutes);

export default router;
