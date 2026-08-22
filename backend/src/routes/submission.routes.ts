import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { saveDraft, finalSubmit } from '../controllers/submission.controller';

const router = Router();

// All submission routes require an authenticated participant
router.use(requireAuth);
router.use(requireRole('participant'));

router.post('/draft', saveDraft);
router.post('/final', finalSubmit);

export default router;
