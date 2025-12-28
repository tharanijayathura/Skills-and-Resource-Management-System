import { Router } from 'express';
import { matchPersonnelForProject, searchPersonnel, getPersonnelUtilization } from '../controllers/matchingController.js';

const router = Router();

// Advanced search & filtering (must come before :projectId)
router.get('/search/personnel', searchPersonnel);

// Personnel utilization visualization (must come before :projectId)
router.get('/utilization/personnel', getPersonnelUtilization);

// Match personnel who meet ALL required skills and minimum proficiencies
router.get('/:projectId', matchPersonnelForProject);

export default router;