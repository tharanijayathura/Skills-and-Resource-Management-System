import pool from '../db.js';

const proficiencyOrderCase = `CASE
  WHEN ps.proficiency_level = 'Beginner' THEN 1
  WHEN ps.proficiency_level = 'Intermediate' THEN 2
  WHEN ps.proficiency_level = 'Advanced' THEN 3
  WHEN ps.proficiency_level = 'Expert' THEN 4
  ELSE 0 END`;

const requirementOrderCase = `CASE
  WHEN prs.minimum_proficiency_level = 'Beginner' THEN 1
  WHEN prs.minimum_proficiency_level = 'Intermediate' THEN 2
  WHEN prs.minimum_proficiency_level = 'Advanced' THEN 3
  WHEN prs.minimum_proficiency_level = 'Expert' THEN 4
  ELSE 0 END`;

export async function matchPersonnelForProject(req, res, next) {
  try {
    const { projectId } = req.params;

    // Total required skills for project
    const [[{ total }]] = await pool.query(
      'SELECT COUNT(*) AS total FROM project_required_skills WHERE project_id = ?',
      [projectId]
    );
    if (!total) return res.json([]);

    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.email, p.role, p.experience_level,
              GROUP_CONCAT(CONCAT(s.skill_name, ':', ps.proficiency_level) ORDER BY s.skill_name SEPARATOR ', ') AS matched_skills,
              COUNT(DISTINCT prs.skill_id) AS matched_count
       FROM personnel p
       JOIN personnel_skills ps ON ps.personnel_id = p.id
       JOIN project_required_skills prs ON prs.skill_id = ps.skill_id AND prs.project_id = ?
       JOIN skills s ON s.id = ps.skill_id
       WHERE ${proficiencyOrderCase} >= ${requirementOrderCase}
       GROUP BY p.id
       HAVING matched_count = ?
       ORDER BY p.experience_level DESC, p.name ASC`,
      [projectId, total]
    );

    const result = rows.map(r => ({
      id: r.id,
      name: r.name,
      email: r.email,
      role: r.role,
      experience_level: r.experience_level,
      matched_skills: r.matched_skills || '',
      match_percentage: 100,
    }));
    res.json(result);
  } catch (err) { next(err); }
}

export async function searchPersonnel(req, res, next) {
  try {
    const { experienceLevel, skillId, minProficiency } = req.query;

    let sql = 'SELECT DISTINCT p.* FROM personnel p';
    const params = [];

    if (skillId) {
      sql += ' JOIN personnel_skills ps ON ps.personnel_id = p.id AND ps.skill_id = ?';
      params.push(skillId);
      if (minProficiency) {
        sql += ` AND (CASE WHEN ps.proficiency_level = 'Beginner' THEN 1 WHEN ps.proficiency_level = 'Intermediate' THEN 2 WHEN ps.proficiency_level = 'Advanced' THEN 3 WHEN ps.proficiency_level = 'Expert' THEN 4 ELSE 0 END) >= ` +
               `(CASE WHEN ? = 'Beginner' THEN 1 WHEN ? = 'Intermediate' THEN 2 WHEN ? = 'Advanced' THEN 3 WHEN ? = 'Expert' THEN 4 ELSE 0 END)`;
        params.push(minProficiency, minProficiency, minProficiency, minProficiency);
      }
    }

    const where = [];
    if (experienceLevel) {
      where.push('p.experience_level = ?');
      params.push(experienceLevel);
    }

    if (where.length) sql += ' WHERE ' + where.join(' AND ');
    sql += ' ORDER BY p.created_at DESC';

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) { next(err); }
}

export async function getPersonnelUtilization(req, res, next) {
  try {
    // Get all personnel with their matched project count
    const [rows] = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.email,
        p.role,
        p.experience_level,
        COUNT(DISTINCT pr.project_id) AS project_count,
        COUNT(DISTINCT CASE WHEN pr.status = 'Active' THEN pr.project_id END) AS active_project_count,
        COUNT(DISTINCT CASE WHEN pr.status = 'Planning' THEN pr.project_id END) AS planning_project_count,
        COUNT(DISTINCT CASE WHEN pr.status = 'Completed' THEN pr.project_id END) AS completed_project_count
      FROM personnel p
      LEFT JOIN (
        SELECT DISTINCT 
          p2.id AS personnel_id,
          prs.project_id,
          proj.status
        FROM personnel p2
        JOIN personnel_skills ps ON ps.personnel_id = p2.id
        JOIN project_required_skills prs ON prs.skill_id = ps.skill_id
        JOIN projects proj ON proj.id = prs.project_id
        WHERE (CASE WHEN ps.proficiency_level = 'Beginner' THEN 1 WHEN ps.proficiency_level = 'Intermediate' THEN 2 WHEN ps.proficiency_level = 'Advanced' THEN 3 WHEN ps.proficiency_level = 'Expert' THEN 4 ELSE 0 END) >= 
              (CASE WHEN prs.minimum_proficiency_level = 'Beginner' THEN 1 WHEN prs.minimum_proficiency_level = 'Intermediate' THEN 2 WHEN prs.minimum_proficiency_level = 'Advanced' THEN 3 WHEN prs.minimum_proficiency_level = 'Expert' THEN 4 ELSE 0 END)
        GROUP BY p2.id, prs.project_id, proj.status
        HAVING COUNT(DISTINCT prs.skill_id) = (
          SELECT COUNT(*) FROM project_required_skills WHERE project_id = prs.project_id
        )
      ) pr ON pr.personnel_id = p.id
      GROUP BY p.id, p.name, p.email, p.role, p.experience_level
      ORDER BY project_count DESC, p.name ASC
    `);

    const result = rows.map(r => ({
      id: r.id,
      name: r.name,
      email: r.email,
      role: r.role,
      experience_level: r.experience_level,
      project_count: parseInt(r.project_count) || 0,
      active_project_count: parseInt(r.active_project_count) || 0,
      planning_project_count: parseInt(r.planning_project_count) || 0,
      completed_project_count: parseInt(r.completed_project_count) || 0,
      utilization_percentage: Math.min(100, (parseInt(r.active_project_count) || 0) * 25), // Simple calculation
    }));

    res.json(result);
  } catch (err) { next(err); }
}