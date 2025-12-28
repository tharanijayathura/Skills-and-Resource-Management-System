import pool from '../db.js';

export async function listSkills(req, res, next) {
  try {
    const [rows] = await pool.query('SELECT * FROM skills ORDER BY skill_name');
    res.json(rows);
  } catch (err) { next(err); }
}

export async function getSkill(req, res, next) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM skills WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Skill not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
}

export async function createSkill(req, res, next) {
  try {
    const { skill_name, category, description } = req.body;
    if (!skill_name) return res.status(400).json({ error: 'skill_name is required' });

    const [result] = await pool.query(
      'INSERT INTO skills (skill_name, category, description) VALUES (?, ?, ?)',
      [skill_name, category || null, description || null]
    );
    const [rows] = await pool.query('SELECT * FROM skills WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
}

export async function updateSkill(req, res, next) {
  try {
    const { id } = req.params;
    const { skill_name, category, description } = req.body;

    await pool.query(
      'UPDATE skills SET skill_name = COALESCE(?, skill_name), category = COALESCE(?, category), description = COALESCE(?, description) WHERE id = ?',
      [skill_name || null, category || null, description || null, id]
    );
    const [rows] = await pool.query('SELECT * FROM skills WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Skill not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
}

export async function deleteSkill(req, res, next) {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM personnel_skills WHERE skill_id = ?', [id]);
    await pool.query('DELETE FROM project_required_skills WHERE skill_id = ?', [id]);
    const [result] = await pool.query('DELETE FROM skills WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Skill not found' });
    res.json({ success: true });
  } catch (err) { next(err); }
}
