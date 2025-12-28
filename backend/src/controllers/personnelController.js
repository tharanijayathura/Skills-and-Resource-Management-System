import pool from '../db.js';

const proficiencyOrder = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Expert: 4,
};

export async function listPersonnel(req, res, next) {
  try {
    const [rows] = await pool.query('SELECT * FROM personnel ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) { next(err); }
}

export async function getPersonnel(req, res, next) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM personnel WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Personnel not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
}

export async function createPersonnel(req, res, next) {
  try {
    const { name, email, role, experience_level } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

    // Ensure email uniqueness
    const [existing] = await pool.query('SELECT id FROM personnel WHERE email = ?', [email]);
    if (existing.length) return res.status(409).json({ error: 'Email already exists' });

    const [result] = await pool.query(
      'INSERT INTO personnel (name, email, role, experience_level) VALUES (?, ?, ?, ?)',
      [name, email, role || null, experience_level || null]
    );
    const [rows] = await pool.query('SELECT * FROM personnel WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
}

export async function updatePersonnel(req, res, next) {
  try {
    const { id } = req.params;
    const { name, email, role, experience_level } = req.body;

    // If email is provided, ensure uniqueness
    if (email) {
      const [existing] = await pool.query('SELECT id FROM personnel WHERE email = ? AND id <> ?', [email, id]);
      if (existing.length) return res.status(409).json({ error: 'Email already exists' });
    }

    await pool.query(
      'UPDATE personnel SET name = COALESCE(?, name), email = COALESCE(?, email), role = COALESCE(?, role), experience_level = COALESCE(?, experience_level) WHERE id = ?',
      [name || null, email || null, role || null, experience_level || null, id]
    );
    const [rows] = await pool.query('SELECT * FROM personnel WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Personnel not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
}

export async function deletePersonnel(req, res, next) {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM personnel_skills WHERE personnel_id = ?', [id]);
    const [result] = await pool.query('DELETE FROM personnel WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Personnel not found' });
    res.json({ success: true });
  } catch (err) { next(err); }
}

export async function listPersonnelSkills(req, res, next) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT ps.skill_id, s.skill_name, ps.proficiency_level FROM personnel_skills ps JOIN skills s ON s.id = ps.skill_id WHERE ps.personnel_id = ? ORDER BY s.skill_name',
      [id]
    );
    res.json(rows);
  } catch (err) { next(err); }
}

export async function assignSkillToPersonnel(req, res, next) {
  try {
    const { id } = req.params; // personnel id
    const { skill_id, proficiency_level } = req.body;
    if (!skill_id || !proficiency_level) return res.status(400).json({ error: 'skill_id and proficiency_level are required' });
    if (!proficiencyOrder[proficiency_level]) return res.status(400).json({ error: 'Invalid proficiency_level' });

    // Upsert behavior: if exists, update; else insert
    const [existing] = await pool.query('SELECT id FROM personnel_skills WHERE personnel_id = ? AND skill_id = ?', [id, skill_id]);
    if (existing.length) {
      await pool.query(
        'UPDATE personnel_skills SET proficiency_level = ? WHERE personnel_id = ? AND skill_id = ?',
        [proficiency_level, id, skill_id]
      );
      return res.json({ updated: true });
    }

    await pool.query(
      'INSERT INTO personnel_skills (personnel_id, skill_id, proficiency_level) VALUES (?, ?, ?)',
      [id, skill_id, proficiency_level]
    );
    res.status(201).json({ created: true });
  } catch (err) { next(err); }
}

export async function updatePersonnelSkill(req, res, next) {
  try {
    const { id, skillId } = req.params;
    const { proficiency_level } = req.body;
    if (!proficiency_level || !proficiencyOrder[proficiency_level]) return res.status(400).json({ error: 'Invalid proficiency_level' });

    const [result] = await pool.query(
      'UPDATE personnel_skills SET proficiency_level = ? WHERE personnel_id = ? AND skill_id = ?',
      [proficiency_level, id, skillId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Assignment not found' });
    res.json({ updated: true });
  } catch (err) { next(err); }
}

export async function deletePersonnelSkill(req, res, next) {
  try {
    const { id, skillId } = req.params;
    const [result] = await pool.query('DELETE FROM personnel_skills WHERE personnel_id = ? AND skill_id = ?', [id, skillId]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Assignment not found' });
    res.json({ deleted: true });
  } catch (err) { next(err); }
}
