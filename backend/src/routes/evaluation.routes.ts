import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { getAssignments, getTeamSubmission, saveEvaluation } from '../controllers/evaluation.controller';

const router = Router();

// All evaluation routes require an authenticated judge
router.use(requireAuth);
router.use(requireRole('judge'));

router.get('/assignments', getAssignments);
router.get('/teams/:teamId', getTeamSubmission);
router.post('/:teamId/draft', (req, res) => saveEvaluation({ ...req, body: { ...req.body, isFinalSubmit: false } } as any, res));
router.post('/:teamId/submit', (req, res) => saveEvaluation({ ...req, body: { ...req.body, isFinalSubmit: true } } as any, res));

export default router;
