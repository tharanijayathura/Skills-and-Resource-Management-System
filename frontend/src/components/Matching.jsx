import { useEffect, useState } from 'react';
import { get } from '../api/client.js';
import Loading from './Loading.jsx';

export default function Matching({ showToast }) {
  const [projects, setProjects] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await get('/projects');
      setProjects(data);
    } catch (error) {
      showToast?.(error.message || 'Error loading projects', 'error');
    }
  };

  const runMatch = async () => {
    if (!selectedId) {
      showToast?.('Please select a project', 'error');
      return;
    }
    try {
      setLoading(true);
      const res = await get(`/matching/${selectedId}`);
      setMatches(res);
      setSelectedProject(projects.find(p => p.id === parseInt(selectedId)));
      if (res.length === 0) {
        showToast?.('No matches found for this project', 'warning');
      } else {
        showToast?.(`Found ${res.length} matching personnel`, 'success');
      }
    } catch (error) {
      showToast?.(error.message || 'Error running matching algorithm', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getProficiencyColor = (level) => {
    const colors = {
      'Beginner': 'var(--warning)',
      'Intermediate': 'var(--info)',
      'Advanced': 'var(--primary)',
      'Expert': 'var(--success)',
    };
    return colors[level] || 'var(--text-light)';
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Match Personnel to Project</h2>
        </div>
        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Select Project</label>
            <select
              className="form-select"
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
            >
              <option value="">Select Project</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.project_name}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button onClick={runMatch} className="btn btn-primary" disabled={loading || !selectedId}>
              {loading ? 'Matching...' : '🔍 Find Matches'}
            </button>
          </div>
        </div>

        {selectedProject && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg)', borderRadius: 'var(--radius-sm)' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Project: {selectedProject.project_name}</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>{selectedProject.description || 'No description'}</p>
          </div>
        )}
      </div>

      {loading ? (
        <Loading message="Finding best matches..." />
      ) : matches.length > 0 ? (
        <div>
          <div className="card" style={{ marginBottom: '1.5rem', background: 'var(--primary)', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, color: 'white' }}>Best Team Matches Found</h3>
                <p style={{ margin: '0.5rem 0 0 0', color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem' }}>
                  {matches.length} personnel member{matches.length > 1 ? 's' : ''} meet all required skills
                </p>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700' }}>✓</div>
            </div>
          </div>
          <div className="grid grid-2">
            {matches.map(m => (
              <div key={m.id} className="card" style={{ position: 'relative' }}>
                <div className="card-header">
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--primary)' }}>{m.name}</h3>
                    <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-light)', fontSize: '0.875rem' }}>
                      {m.role || 'No role specified'} • {m.email}
                    </p>
                  </div>
                  <div className="match-score">
                    <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>{m.match_percentage || '100%'}</span>
                    <div className="match-score-bar">
                      <div className="match-score-fill" style={{ width: '100%' }}></div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>Perfect Match</div>
                  </div>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <span className={`badge badge-${m.experience_level === 'Senior' ? 'success' : m.experience_level === 'Mid-Level' ? 'info' : 'warning'}`}>
                      {m.experience_level}
                    </span>
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.875rem', color: 'var(--text-light)', display: 'block', marginBottom: '0.5rem' }}>Matched Skills:</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {m.matched_skills?.split(', ').map((skill, idx) => {
                        // Handle format: "SkillName:ProficiencyLevel"
                        const parts = skill.split(':');
                        const skillName = parts[0] || skill;
                        const proficiency = parts[1] || '';
                        return (
                          <div
                            key={idx}
                            className="skill-tag"
                            style={{
                              background: `${getProficiencyColor(proficiency)}20`,
                              color: getProficiencyColor(proficiency),
                              border: `1px solid ${getProficiencyColor(proficiency)}40`,
                            }}
                          >
                            {skillName} {proficiency && <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>({proficiency})</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : selectedId ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-text">No matches found</div>
            <div className="empty-state-subtext">No personnel meet all the required skills for this project</div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-text">Select a project to find matches</div>
            <div className="empty-state-subtext">Choose a project from the dropdown above</div>
          </div>
        </div>
      )}
    </div>
  );
}
