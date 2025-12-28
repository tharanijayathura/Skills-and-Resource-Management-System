import { Router } from 'express';
import {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  listProjectRequirements,
  addProjectRequirement,
  updateProjectRequirement,
  deleteProjectRequirement,
} from '../controllers/projectsController.js';

const router = Router();

// Projects CRUD
router.get('/', listProjects);
router.get('/:id', getProject);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

// Project required skills
router.get('/:id/requirements', listProjectRequirements);
router.post('/:id/requirements', addProjectRequirement);
router.put('/:id/requirements/:skillId', updateProjectRequirement);
router.delete('/:id/requirements/:skillId', deleteProjectRequirement);

export default router;