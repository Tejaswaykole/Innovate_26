import { Router } from 'express';
import { getHackathonConfig } from '../controllers/admin.controller';

const router = Router();

router.get('/', (req, res) => { res.json({ message: 'Participant placeholder' }) });
router.get('/hackathon', getHackathonConfig);

export default router;
