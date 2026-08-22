import { Router } from 'express';
import { getPublishedResults, getAnnouncements, getRules } from '../controllers/public.controller';

const router = Router();

router.get('/results', getPublishedResults);

router.get('/announcements', getAnnouncements);
router.get('/rules', getRules);

export default router;
