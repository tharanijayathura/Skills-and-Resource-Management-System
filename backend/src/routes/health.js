import { Router } from 'express';
import { dbHealth } from '../controllers/healthController.js';

const router = Router();

// GET /api/health/db -> checks database connectivity
router.get('/db', dbHealth);

export default router;
