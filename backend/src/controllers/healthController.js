import pool from '../db.js';

export async function dbHealth(req, res, next) {
  try {
    const [[ver]] = await pool.query('SELECT VERSION() AS version');
    const [[now]] = await pool.query('SELECT NOW() AS now');
    const [[db]] = await pool.query('SELECT DATABASE() AS db');
    res.json({
      status: 'ok',
      database: {
        connected: true,
        version: ver.version,
        name: db.db,
        time: now.now,
      },
    });
  } catch (err) {
    // Return meaningful health result while still delegating error handling
    err.status = 503;
    err.message = `Database health check failed: ${err.message}`;
    next(err);
  }
}
