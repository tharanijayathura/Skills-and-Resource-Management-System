import { useEffect, useState } from 'react';
import { get, post, put, del } from '../api/client.js';
import Modal from './Modal.jsx';
import Loading from './Loading.jsx';

export default function Projects({ showToast }) {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({ project_name: '', description: '', start_date: '', end_date: '', status: 'Planning' });
  const [selected, setSelected] = useState(null);
  const [req, setReq] = useState({ skill_id: '', minimum_proficiency_level: 'Beginner' });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await get('/projects');
      setProjects(data);
    } catch (error) {
      showToast?.(error.message || 'Error loading projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadSkills = async () => {
    try {
      const data = await get('/skills');
      setSkills(data);
    } catch (error) {
      showToast?.(error.message || 'Error loading skills', 'error');
    }
  };

  const loadReqs = async (id) => {
    try {
      const requirements = await get(`/projects/${id}/requirements`);
      setSelected(prev => prev ? { ...prev, requirements } : null);
    } catch (error) {
      showToast?.(error.message || 'Error loading requirements', 'error');
    }
  };

  useEffect(() => {
    load();
    loadSkills();
  }, []);

  const create = async () => {
    if (!form.project_name) {
      showToast?.('Project name is required', 'error');
      return;
    }
    try {
      const p = await post('/projects', form);
      setForm({ project_name: '', description: '', start_date: '', end_date: '', status: 'Planning' });
      setProjects([p, ...projects]);
      setIsModalOpen(false);
      showToast?.('Project created successfully', 'success');
    } catch (error) {
      showToast?.(error.message || 'Error creating project', 'error');
    }
  };

  const update = async (p) => {
    try {
      await put(`/projects/${p.id}`, p);
      showToast?.('Project updated successfully', 'success');
    } catch (error) {
      showToast?.(error.message || 'Error updating project', 'error');
    }
  };

  const remove = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await del(`/projects/${id}`);
      setProjects(projects.filter(x => x.id !== id));
      if (selected?.id === id) setSelected(null);
      showToast?.('Project deleted successfully', 'success');
    } catch (error) {
      showToast?.(error.message || 'Error deleting project', 'error');
    }
  };

  const select = async (p) => {
    setSelected(p);
    await loadReqs(p.id);
    setIsReqModalOpen(true);
  };

  const addRequirement = async () => {
    if (!selected || !selected.id || !req.skill_id) {
      showToast?.('Please select a skill', 'error');
      return;
    }
    try {
      const projectId = selected.id;
      await post(`/projects/${projectId}/requirements`, req);
      await loadReqs(projectId);
      setReq({ skill_id: '', minimum_proficiency_level: 'Beginner' });
      showToast?.('Requirement added successfully', 'success');
    } catch (error) {
      showToast?.(error.message || 'Error adding requirement', 'error');
    }
  };

  const updateRequirement = async (skill_id, minimum_proficiency_level) => {
    if (!selected || !selected.id) return;
    try {
      const projectId = selected.id;
      await put(`/projects/${projectId}/requirements/${skill_id}`, { minimum_proficiency_level });
      await loadReqs(projectId);
      showToast?.('Requirement updated successfully', 'success');
    } catch (error) {
      showToast?.(error.message || 'Error updating requirement', 'error');
    }
  };

  const removeRequirement = async (skill_id) => {
    if (!selected || !selected.id) return;
    try {
      const projectId = selected.id;
      await del(`/projects/${projectId}/requirements/${skill_id}`);
      await loadReqs(projectId);
      showToast?.('Requirement removed successfully', 'success');
    } catch (error) {
      showToast?.(error.message || 'Error removing requirement', 'error');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Planning': 'badge-warning',
      'Active': 'badge-success',
      'Completed': 'badge-info',
    };
    return badges[status] || 'badge-secondary';
  };

  const exportData = () => {
    const csv = [
      ['Project Name', 'Description', 'Status', 'Start Date', 'End Date'].join(','),
      ...projects.map(p => [
        p.project_name,
        (p.description || '').replace(/,/g, ';'),
        p.status,
        p.start_date || '',
        p.end_date || ''
      ].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'projects.csv';
    a.click();
    showToast?.('Data exported successfully', 'success');
  };

  if (loading) {
    return <Loading message="Loading projects..." />;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Project Management</h2>
          <div className="flex gap-2">
            <button onClick={exportData} className="btn btn-secondary btn-sm">📥 Export CSV</button>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">+ Create Project</button>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-text">No projects found</div>
            <div className="empty-state-subtext">Create your first project to get started</div>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p.id}>
                    <td>
                      {editing?.id === p.id ? (
                        <input
                          className="form-input"
                          value={p.project_name || ''}
                          onChange={e => setProjects(projects.map(x => x.id === p.id ? { ...x, project_name: e.target.value } : x))}
                          onBlur={() => { update(projects.find(x => x.id === p.id)); setEditing(null); }}
                          autoFocus
                        />
                      ) : (
                        <div>
                          <span onClick={() => setEditing(p)} style={{ cursor: 'pointer', fontWeight: '600' }}>{p.project_name}</span>
                          {p.description && (
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                              {p.description.length > 50 ? p.description.substring(0, 50) + '...' : p.description}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td>
                      {editing?.id === p.id ? (
                        <select
                          className="form-select"
                          value={p.status || 'Planning'}
                          onChange={e => setProjects(projects.map(x => x.id === p.id ? { ...x, status: e.target.value } : x))}
                          onBlur={() => { update(projects.find(x => x.id === p.id)); setEditing(null); }}
                        >
                          <option>Planning</option>
                          <option>Active</option>
                          <option>Completed</option>
                        </select>
                      ) : (
                        <span className={`badge ${getStatusBadge(p.status)}`}>{p.status}</span>
                      )}
                    </td>
                    <td>
                      {editing?.id === p.id ? (
                        <input
                          type="date"
                          className="form-input"
                          value={p.start_date || ''}
                          onChange={e => setProjects(projects.map(x => x.id === p.id ? { ...x, start_date: e.target.value } : x))}
                          onBlur={() => { update(projects.find(x => x.id === p.id)); setEditing(null); }}
                        />
                      ) : (
                        <span>{p.start_date || '—'}</span>
                      )}
                    </td>
                    <td>
                      {editing?.id === p.id ? (
                        <input
                          type="date"
                          className="form-input"
                          value={p.end_date || ''}
                          onChange={e => setProjects(projects.map(x => x.id === p.id ? { ...x, end_date: e.target.value } : x))}
                          onBlur={() => { update(projects.find(x => x.id === p.id)); setEditing(null); }}
                        />
                      ) : (
                        <span>{p.end_date || '—'}</span>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => select(p)} className="btn btn-sm btn-primary">Requirements</button>
                        <button onClick={() => remove(p.id)} className="btn btn-sm btn-danger">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        <div className="form-group">
          <label className="form-label">Project Name *</label>
          <input
            className="form-input"
            placeholder="e.g., E-commerce Platform"
            value={form.project_name}
            onChange={e => setForm({ ...form, project_name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-input"
            rows="3"
            placeholder="Project description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-input"
              value={form.start_date}
              onChange={e => setForm({ ...form, start_date: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-input"
              value={form.end_date}
              onChange={e => setForm({ ...form, end_date: e.target.value })}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}
          >
            <option>Planning</option>
            <option>Active</option>
            <option>Completed</option>
            <option>On Hold</option>
            <option>Cancelled</option>
            <option>Archived</option>
          </select>
        </div>
        <div className="flex gap-2" style={{ marginTop: '1.5rem' }}>
          <button onClick={create} className="btn btn-primary">Create</button>
          <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
        </div>
      </Modal>

      <Modal isOpen={isReqModalOpen} onClose={() => setIsReqModalOpen(false)} title={`Required Skills: ${selected?.project_name || ''}`}>
        <div className="form-group">
          <label className="form-label">Select Skill</label>
          <select
            className="form-select"
            value={req.skill_id}
            onChange={e => setReq({ ...req, skill_id: e.target.value })}
          >
            <option value="">Select Skill</option>
            {skills.map(s => <option key={s.id} value={s.id}>{s.skill_name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Minimum Proficiency Level</label>
          <select
            className="form-select"
            value={req.minimum_proficiency_level}
            onChange={e => setReq({ ...req, minimum_proficiency_level: e.target.value })}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Expert</option>
          </select>
        </div>
        <button onClick={addRequirement} className="btn btn-primary" style={{ marginBottom: '1.5rem' }}>Add Requirement</button>

        {(selected?.requirements || []).length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Min Proficiency</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(selected?.requirements || []).map(r => (
                  <tr key={r.skill_id}>
                    <td><span className="skill-tag">{r.skill_name}</span></td>
                    <td>
                      <select
                        className="form-select"
                        value={r.minimum_proficiency_level}
                        onChange={e => updateRequirement(r.skill_id, e.target.value)}
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                        <option>Expert</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => removeRequirement(r.skill_id)} className="btn btn-sm btn-danger">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-text">No requirements added</div>
            <div className="empty-state-subtext">Add required skills for this project</div>
          </div>
        )}
      </Modal>
    </div>
  );
}
