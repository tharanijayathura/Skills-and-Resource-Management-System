import { useEffect, useState } from 'react';
import { get, post, put, del } from '../api/client.js';
import Modal from './Modal.jsx';
import Loading from './Loading.jsx';

export default function Personnel({ showToast }) {
  const [list, setList] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: '', experience_level: '' });
  const [assignment, setAssignment] = useState({ skill_id: '', proficiency_level: 'Beginner' });
  const [editing, setEditing] = useState(null);
  const [newPersonnelSkills, setNewPersonnelSkills] = useState([]); // Skills to add when creating new personnel

  const load = async () => {
    try {
      setLoading(true);
      const data = await get('/personnel');
      setList(data);
    } catch (error) {
      showToast?.(error.message || 'Error loading personnel', 'error');
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

  const loadSelectedSkills = async (id) => {
    try {
      const skills = await get(`/personnel/${id}/skills`);
      setSelected({ ...selected, skills });
    } catch (error) {
      showToast?.(error.message || 'Error loading skills', 'error');
    }
  };

  useEffect(() => {
    load();
    loadSkills();
  }, []);

  const create = async () => {
    if (!form.name || !form.email) {
      showToast?.('Name and email are required', 'error');
      return;
    }
    try {
      // Create personnel first
      const p = await post('/personnel', form);
      
      // Add skills if any were selected
      if (newPersonnelSkills.length > 0) {
        for (const skill of newPersonnelSkills) {
          await post(`/personnel/${p.id}/skills`, {
            skill_id: skill.skill_id,
            proficiency_level: skill.proficiency_level
          });
        }
      }
      
      setForm({ name: '', email: '', role: '', experience_level: '' });
      setNewPersonnelSkills([]);
      setList([p, ...list]);
      setIsModalOpen(false);
      showToast?.(`Personnel created successfully${newPersonnelSkills.length > 0 ? ` with ${newPersonnelSkills.length} skill(s)` : ''}`, 'success');
    } catch (error) {
      showToast?.(error.message || 'Error creating personnel', 'error');
    }
  };

  const addSkillToNewPersonnel = () => {
    if (!assignment.skill_id) {
      showToast?.('Please select a skill', 'error');
      return;
    }
    // Check if skill already added
    if (newPersonnelSkills.find(s => s.skill_id === assignment.skill_id)) {
      showToast?.('This skill is already added', 'warning');
      return;
    }
    setNewPersonnelSkills([...newPersonnelSkills, { ...assignment }]);
    setAssignment({ skill_id: '', proficiency_level: 'Beginner' });
  };

  const removeSkillFromNewPersonnel = (skillId) => {
    setNewPersonnelSkills(newPersonnelSkills.filter(s => s.skill_id !== skillId));
  };

  const update = async (p) => {
    try {
      await put(`/personnel/${p.id}`, { name: p.name, email: p.email, role: p.role, experience_level: p.experience_level });
      await load(); // Reload the list after update
      setEditing(null); // Clear editing state
      showToast?.('Personnel updated successfully', 'success');
    } catch (error) {
      showToast?.(error.message || 'Error updating personnel', 'error');
    }
  };

  const remove = async (id) => {
    if (!confirm('Are you sure you want to delete this personnel?')) return;
    try {
      await del(`/personnel/${id}`);
      setList(list.filter(x => x.id !== id));
      if (selected?.id === id) setSelected(null);
      showToast?.('Personnel deleted successfully', 'success');
    } catch (error) {
      showToast?.(error.message || 'Error deleting personnel', 'error');
    }
  };

  const select = async (p) => {
    setSelected(p);
    await loadSelectedSkills(p.id);
    setIsSkillModalOpen(true);
  };

  const assignSkill = async () => {
    if (!selected || !assignment.skill_id) {
      showToast?.('Please select a skill', 'error');
      return;
    }
    try {
      await post(`/personnel/${selected.id}/skills`, assignment);
      await loadSelectedSkills(selected.id);
      setAssignment({ skill_id: '', proficiency_level: 'Beginner' });
      showToast?.('Skill assigned successfully', 'success');
    } catch (error) {
      showToast?.(error.message || 'Error assigning skill', 'error');
    }
  };

  const updateSkill = async (skill_id, proficiency_level) => {
    if (!selected) return;
    try {
      await put(`/personnel/${selected.id}/skills/${skill_id}`, { proficiency_level });
      await loadSelectedSkills(selected.id);
      showToast?.('Skill updated successfully', 'success');
    } catch (error) {
      showToast?.(error.message || 'Error updating skill', 'error');
    }
  };

  const removeSkill = async (skill_id) => {
    if (!selected) return;
    try {
      await del(`/personnel/${selected.id}/skills/${skill_id}`);
      await loadSelectedSkills(selected.id);
      showToast?.('Skill removed successfully', 'success');
    } catch (error) {
      showToast?.(error.message || 'Error removing skill', 'error');
    }
  };

  const exportData = () => {
    const csv = [
      ['Name', 'Email', 'Role', 'Experience Level', 'Created At'].join(','),
      ...list.map(p => [p.name, p.email, p.role || '', p.experience_level || '', p.created_at || ''].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'personnel.csv';
    a.click();
    showToast?.('Data exported successfully', 'success');
  };

  if (loading) {
    return <Loading message="Loading personnel..." />;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Personnel Management</h2>
          <div className="flex gap-2">
            <button onClick={exportData} className="btn btn-secondary btn-sm">📥 Export CSV</button>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">+ Add Personnel</button>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-text">No personnel found</div>
            <div className="empty-state-subtext">Add your first team member to get started</div>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Experience</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(p => (
                  <tr key={p.id}>
                    <td>
                      {editing?.id === p.id ? (
                        <input
                          className="form-input"
                          value={p.name || ''}
                          onChange={e => setList(list.map(x => x.id === p.id ? { ...x, name: e.target.value } : x))}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              update(list.find(x => x.id === p.id));
                            } else if (e.key === 'Escape') {
                              setEditing(null);
                              load();
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        <span>{p.name}</span>
                      )}
                    </td>
                    <td>
                      {editing?.id === p.id ? (
                        <input
                          className="form-input"
                          value={p.email || ''}
                          onChange={e => setList(list.map(x => x.id === p.id ? { ...x, email: e.target.value } : x))}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              update(list.find(x => x.id === p.id));
                            } else if (e.key === 'Escape') {
                              setEditing(null);
                              load();
                            }
                          }}
                        />
                      ) : (
                        <span>{p.email}</span>
                      )}
                    </td>
                    <td>
                      {editing?.id === p.id ? (
                        <input
                          className="form-input"
                          value={p.role || ''}
                          onChange={e => setList(list.map(x => x.id === p.id ? { ...x, role: e.target.value } : x))}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              update(list.find(x => x.id === p.id));
                            } else if (e.key === 'Escape') {
                              setEditing(null);
                              load();
                            }
                          }}
                        />
                      ) : (
                        <span>{p.role || '—'}</span>
                      )}
                    </td>
                    <td>
                      {editing?.id === p.id ? (
                        <select
                          className="form-select"
                          value={p.experience_level || ''}
                          onChange={e => {
                            const updated = list.find(x => x.id === p.id);
                            updated.experience_level = e.target.value;
                            setList([...list]);
                            update(updated);
                          }}
                        >
                          <option value="">Select</option>
                          <option>Junior</option>
                          <option>Mid-Level</option>
                          <option>Senior</option>
                        </select>
                      ) : (
                        <span className={`badge badge-${p.experience_level === 'Senior' ? 'success' : p.experience_level === 'Mid-Level' ? 'info' : 'warning'}`}>
                          {p.experience_level || '—'}
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-1">
                        {editing?.id === p.id ? (
                          <>
                            <button 
                              onClick={() => update(list.find(x => x.id === p.id))} 
                              className="btn btn-sm btn-success"
                              title="Save changes"
                            >
                              ✓ Save
                            </button>
                            <button 
                              onClick={() => { setEditing(null); load(); }} 
                              className="btn btn-sm btn-secondary"
                              title="Cancel editing"
                            >
                              ✕ Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => setEditing(p)} 
                              className="btn btn-sm btn-secondary"
                              title="Edit personnel info"
                            >
                              ✏️ Edit
                            </button>
                            <button onClick={() => select(p)} className="btn btn-sm btn-primary">Skills</button>
                            <button onClick={() => remove(p.id)} className="btn btn-sm btn-danger">Delete</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setNewPersonnelSkills([]); }} title="Add New Personnel">
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--primary)', fontSize: '1.125rem' }}>Basic Information</h3>
          <div className="form-group">
            <label className="form-label">Name *</label>
            <input
              className="form-input"
              placeholder="John Doe"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              className="form-input"
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
            >
              <option value="">Select Role</option>
              <option>Frontend Developer</option>
              <option>Backend Developer</option>
              <option>Full Stack Developer</option>
              <option>Mobile Developer</option>
              <option>DevOps Engineer</option>
              <option>UI/UX Designer</option>
              <option>QA Engineer</option>
              <option>Data Analyst</option>
              <option>Business Analyst</option>
              <option>System Administrator</option>
              <option>Database Administrator</option>
              <option>Security Engineer</option>
              <option>Technical Lead</option>
              
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Experience Level</label>
            <select
              className="form-select"
              value={form.experience_level}
              onChange={e => setForm({ ...form, experience_level: e.target.value })}
            >
              <option value="">Select Level</option>
              <option>Junior</option>
              <option>Mid-Level</option>
              <option>Senior</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '2rem', paddingTop: '1.5rem', borderTop: '2px solid var(--border)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--primary)', fontSize: '1.125rem' }}>Skills & Proficiencies</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
            Add skills from their CV or profile. You can add more skills later.
          </p>
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Select Skill</label>
              <select
                className="form-select"
                value={assignment.skill_id}
                onChange={e => setAssignment({ ...assignment, skill_id: e.target.value })}
              >
                <option value="">Choose a skill...</option>
                {skills.map(s => <option key={s.id} value={s.id}>{s.skill_name} {s.category ? `(${s.category})` : ''}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Proficiency Level</label>
              <select
                className="form-select"
                value={assignment.proficiency_level}
                onChange={e => setAssignment({ ...assignment, proficiency_level: e.target.value })}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Expert</option>
              </select>
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button onClick={addSkillToNewPersonnel} className="btn btn-primary">Add Skill</button>
            </div>
          </div>

          {newPersonnelSkills.length > 0 && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text)' }}>
                Skills to be added ({newPersonnelSkills.length}):
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {newPersonnelSkills.map((skill, idx) => {
                  const skillName = skills.find(s => s.id === parseInt(skill.skill_id))?.skill_name || 'Unknown';
                  return (
                    <div
                      key={idx}
                      className="skill-tag"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                    >
                      <span>{skillName} ({skill.proficiency_level})</span>
                      <button
                        onClick={() => removeSkillFromNewPersonnel(skill.skill_id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--danger)',
                          cursor: 'pointer',
                          padding: '0',
                          fontSize: '1.25rem',
                          lineHeight: '1'
                        }}
                        title="Remove skill"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2" style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '2px solid var(--border)' }}>
          <button onClick={create} className="btn btn-primary">
            Create Personnel{newPersonnelSkills.length > 0 ? ` with ${newPersonnelSkills.length} Skill(s)` : ''}
          </button>
          <button onClick={() => { setIsModalOpen(false); setNewPersonnelSkills([]); }} className="btn btn-secondary">Cancel</button>
        </div>
      </Modal>

      <Modal isOpen={isSkillModalOpen} onClose={() => setIsSkillModalOpen(false)} title={`Skills for ${selected?.name || ''}`}>
        <div className="form-group">
          <label className="form-label">Select Skill</label>
          <select
            className="form-select"
            value={assignment.skill_id}
            onChange={e => setAssignment({ ...assignment, skill_id: e.target.value })}
          >
            <option value="">Select Skill</option>
            {skills.map(s => <option key={s.id} value={s.id}>{s.skill_name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Proficiency Level</label>
          <select
            className="form-select"
            value={assignment.proficiency_level}
            onChange={e => setAssignment({ ...assignment, proficiency_level: e.target.value })}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Expert</option>
          </select>
        </div>
        <button onClick={assignSkill} className="btn btn-primary" style={{ marginBottom: '1.5rem' }}>Assign Skill</button>

        {(selected?.skills || []).length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Proficiency</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(selected?.skills || []).map(s => (
                  <tr key={s.skill_id}>
                    <td><span className="skill-tag">{s.skill_name}</span></td>
                    <td>
                      <select
                        className="form-select"
                        value={s.proficiency_level}
                        onChange={e => updateSkill(s.skill_id, e.target.value)}
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                        <option>Expert</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => removeSkill(s.skill_id)} className="btn btn-sm btn-danger">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🎯</div>
            <div className="empty-state-text">No skills assigned</div>
          </div>
        )}
      </Modal>
    </div>
  );
}
