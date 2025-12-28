import pool from '../db.js';

export async function listProjects(req, res, next) {
  try {
    const [rows] = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) { next(err); }
}

export async function getProject(req, res, next) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Project not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
}

export async function createProject(req, res, next) {
  try {
    const { project_name, description, start_date, end_date, status } = req.body;
    if (!project_name) return res.status(400).json({ error: 'project_name is required' });

    const [result] = await pool.query(
      'INSERT INTO projects (project_name, description, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
      [project_name, description || null, start_date || null, end_date || null, status || 'Planning']
    );
    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
}

export async function updateProject(req, res, next) {
  try {
    const { id } = req.params;
    const { project_name, description, start_date, end_date, status } = req.body;

    await pool.query(
      'UPDATE projects SET project_name = COALESCE(?, project_name), description = COALESCE(?, description), start_date = COALESCE(?, start_date), end_date = COALESCE(?, end_date), status = COALESCE(?, status) WHERE id = ?',
      [project_name || null, description || null, start_date || null, end_date || null, status || null, id]
    );
    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Project not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
}

export async function deleteProject(req, res, next) {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM project_required_skills WHERE project_id = ?', [id]);
    const [result] = await pool.query('DELETE FROM projects WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Project not found' });
    res.json({ success: true });
  } catch (err) { next(err); }
}

export async function listProjectRequirements(req, res, next) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT prs.skill_id, s.skill_name, prs.minimum_proficiency_level FROM project_required_skills prs JOIN skills s ON s.id = prs.skill_id WHERE prs.project_id = ? ORDER BY s.skill_name',
      [id]
    );
    res.json(rows);
  } catch (err) { next(err); }
}

export async function addProjectRequirement(req, res, next) {
  try {
    const { id } = req.params; // project id
    const { skill_id, minimum_proficiency_level } = req.body;
    if (!skill_id || !minimum_proficiency_level) return res.status(400).json({ error: 'skill_id and minimum_proficiency_level are required' });
    await pool.query(
      'INSERT INTO project_required_skills (project_id, skill_id, minimum_proficiency_level) VALUES (?, ?, ?)',
      [id, skill_id, minimum_proficiency_level]
    );
    res.status(201).json({ created: true });
  } catch (err) { next(err); }
}

export async function updateProjectRequirement(req, res, next) {
  try {
    const { id, skillId } = req.params;
    const { minimum_proficiency_level } = req.body;
    if (!minimum_proficiency_level) return res.status(400).json({ error: 'minimum_proficiency_level is required' });
    const [result] = await pool.query(
      'UPDATE project_required_skills SET minimum_proficiency_level = ? WHERE project_id = ? AND skill_id = ?',
      [minimum_proficiency_level, id, skillId]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Requirement not found' });
    res.json({ updated: true });
  } catch (err) { next(err); }
}

export async function deleteProjectRequirement(req, res, next) {
  try {
    const { id, skillId } = req.params;
    const [result] = await pool.query('DELETE FROM project_required_skills WHERE project_id = ? AND skill_id = ?', [id, skillId]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Requirement not found' });
    res.json({ deleted: true });
  } catch (err) { next(err); }
}
