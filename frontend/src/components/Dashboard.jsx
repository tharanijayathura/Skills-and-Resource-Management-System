import { useEffect, useState } from 'react';
import { get } from '../api/client.js';
import Loading from './Loading.jsx';

export default function Dashboard() {
  const [stats, setStats] = useState({
    personnel: 0,
    skills: 0,
    projects: 0,
    activeProjects: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentProjects, setRecentProjects] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [personnel, skills, projects] = await Promise.all([
        get('/personnel'),
        get('/skills'),
        get('/projects'),
      ]);

      setStats({
        personnel: personnel.length,
        skills: skills.length,
        projects: projects.length,
        activeProjects: projects.filter(p => p.status === 'Active').length,
      });

      setRecentProjects(projects.slice(0, 5));
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  return (
    <div>
      {/* Hero Section with Background Image */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Skills Management</h1>
          <p>Manage your team's skills and match them to projects efficiently</p>
          <button
            className="btn btn-info"
            style={{ marginTop: '1rem', fontWeight: 600 }}
            onClick={() => window.location.href = '/how-to-work'}
          >
            📖 Project Guide
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Dashboard Overview</h2>
        </div>
        <div className="grid grid-4">
          <div className="stat-card" style={{ borderLeftColor: 'var(--primary)' }}>
            <div className="stat-label">Total Personnel</div>
            <div className="stat-value">{stats.personnel}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: 'var(--secondary)' }}>
            <div className="stat-label">Skills Catalog</div>
            <div className="stat-value">{stats.skills}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: 'var(--info)' }}>
            <div className="stat-label">Total Projects</div>
            <div className="stat-value">{stats.projects}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: 'var(--success)' }}>
            <div className="stat-label">Active Projects</div>
            <div className="stat-value">{stats.activeProjects}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Projects</h2>
        </div>
        {recentProjects.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map(project => (
                  <tr key={project.id}>
                    <td>{project.project_name}</td>
                    <td>
                      <span className={`badge badge-${project.status === 'Active' ? 'success' : project.status === 'Completed' ? 'info' : 'warning'}`}>
                        {project.status}
                      </span>
                    </td>
                    <td>{project.start_date || 'N/A'}</td>
                    <td>{project.end_date || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-text">No projects yet</div>
            <div className="empty-state-subtext">Create your first project to get started</div>
          </div>
        )}
      </div>
    </div>
  );
}

