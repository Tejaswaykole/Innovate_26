import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { 
  createTeam, 
  submitJoinRequest, 
  acceptJoinRequest, 
  rejectJoinRequest,
  deleteTeam,
  removeMember
} from '../controllers/team.controller';

const router = Router();

// All team routes require the user to be an authenticated participant
router.use(requireAuth);
router.use(requireRole('participant'));

router.post('/', createTeam);
router.post('/join', submitJoinRequest);
router.post('/requests/:requestId/accept', acceptJoinRequest);
router.post('/requests/:requestId/reject', rejectJoinRequest);
router.delete('/:teamId', deleteTeam);
router.delete('/:teamId/members/:memberId', removeMember);

export default router;
