import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import personnelRoutes from './routes/personnel.js';
import skillsRoutes from './routes/skills.js';
import projectsRoutes from './routes/projects.js';
import matchingRoutes from './routes/matching.js';
import healthRoutes from './routes/health.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Database health checks
app.use('/api/health', healthRoutes);

app.use('/api/personnel', personnelRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/matching', matchingRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err); // eslint-disable-line no-console
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

export default app;