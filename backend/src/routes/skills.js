import { Router } from 'express';
import { listSkills, getSkill, createSkill, updateSkill, deleteSkill } from '../controllers/skillsController.js';

const router = Router();

router.get('/', listSkills);
router.get('/:id', getSkill);
router.post('/', createSkill);
router.put('/:id', updateSkill);
router.delete('/:id', deleteSkill);

export default router;