import { useEffect, useState } from 'react';
import { get } from '../api/client.js';
import Loading from './Loading.jsx';

export default function Utilization({ showToast }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUtilization();
  }, []);

  const loadUtilization = async () => {
    try {
      setLoading(true);
      const result = await get('/matching/utilization/personnel');
      setData(result);
    } catch (error) {
      showToast?.(error.message || 'Error loading utilization data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getUtilizationColor = (percentage) => {
    if (percentage >= 80) return 'var(--danger)';
    if (percentage >= 60) return 'var(--warning)';
    if (percentage >= 40) return 'var(--info)';
    return 'var(--success)';
  };

  const getUtilizationLabel = (percentage) => {
    if (percentage >= 80) return 'Over-utilized';
    if (percentage >= 60) return 'High';
    if (percentage >= 40) return 'Moderate';
    if (percentage >= 20) return 'Low';
    return 'Available';
  };

  if (loading) {
    return <Loading message="Loading utilization data..." />;
  }

  const maxProjects = Math.max(...data.map(d => d.project_count), 1);

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Personnel Utilization Visualization</h2>
          <button onClick={loadUtilization} className="btn btn-secondary btn-sm">🔄 Refresh</button>
        </div>
        <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
          This visualization shows how personnel are allocated across projects. Utilization is calculated based on active project assignments.
        </p>

        {data.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-text">No utilization data available</div>
            <div className="empty-state-subtext">Create projects and assign personnel to see utilization</div>
          </div>
        ) : (
          <div className="grid grid-2">
            {data.map(person => (
              <div key={person.id} className="card">
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{person.name}</h3>
                    <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-light)', fontSize: '0.875rem' }}>
                      {person.role || 'No role'} • <span className={`badge badge-${person.experience_level === 'Senior' ? 'success' : person.experience_level === 'Mid-Level' ? 'info' : 'warning'}`}>
                        {person.experience_level}
                      </span>
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: getUtilizationColor(person.utilization_percentage) }}>
                      {person.utilization_percentage}%
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                      {getUtilizationLabel(person.utilization_percentage)}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Total Projects: {person.project_count}</span>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: '12px', 
                    background: 'var(--border)', 
                    borderRadius: '9999px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(person.project_count / maxProjects) * 100}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${getUtilizationColor(person.utilization_percentage)} 0%, ${getUtilizationColor(person.utilization_percentage)}80 100%)`,
                      transition: 'width 0.5s ease'
                    }}></div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '1rem' }}>
                  <div style={{ textAlign: 'center', padding: '0.75rem', background: 'var(--bg)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--success)' }}>
                      {person.active_project_count}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>Active</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '0.75rem', background: 'var(--bg)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--warning)' }}>
                      {person.planning_project_count}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>Planning</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '0.75rem', background: 'var(--bg)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--info)' }}>
                      {person.completed_project_count}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>Completed</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '1rem' }}>Utilization Summary</h3>
        <div className="grid grid-4">
          <div className="stat-card" style={{ borderLeftColor: 'var(--success)' }}>
            <div className="stat-label">Available</div>
            <div className="stat-value">{data.filter(d => d.utilization_percentage < 40).length}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Under 40%</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: 'var(--info)' }}>
            <div className="stat-label">Moderate</div>
            <div className="stat-value">{data.filter(d => d.utilization_percentage >= 40 && d.utilization_percentage < 60).length}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>40-60%</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: 'var(--warning)' }}>
            <div className="stat-label">High</div>
            <div className="stat-value">{data.filter(d => d.utilization_percentage >= 60 && d.utilization_percentage < 80).length}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>60-80%</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: 'var(--danger)' }}>
            <div className="stat-label">Over-utilized</div>
            <div className="stat-value">{data.filter(d => d.utilization_percentage >= 80).length}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Over 80%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

