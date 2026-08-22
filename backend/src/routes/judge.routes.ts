import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => { res.json({ message: 'Judge placeholder' }) });

export default router;
