import { Router } from 'express';
import {
  listPersonnel,
  getPersonnel,
  createPersonnel,
  updatePersonnel,
  deletePersonnel,
  listPersonnelSkills,
  assignSkillToPersonnel,
  updatePersonnelSkill,
  deletePersonnelSkill,
} from '../controllers/personnelController.js';

const router = Router();

// Personnel CRUD
router.get('/', listPersonnel);
router.get('/:id', getPersonnel);
router.post('/', createPersonnel);
router.put('/:id', updatePersonnel);
router.delete('/:id', deletePersonnel);

// Personnel Skills
router.get('/:id/skills', listPersonnelSkills);
router.post('/:id/skills', assignSkillToPersonnel);
router.put('/:id/skills/:skillId', updatePersonnelSkill);
router.delete('/:id/skills/:skillId', deletePersonnelSkill);

export default router;