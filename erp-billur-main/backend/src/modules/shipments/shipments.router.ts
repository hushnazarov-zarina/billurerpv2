import { Router } from 'express';
import { requireAuth } from '../../shared/middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  res.json({ ok: true, module: 'shipments', message: 'TODO: implement' });
});

export default router;
