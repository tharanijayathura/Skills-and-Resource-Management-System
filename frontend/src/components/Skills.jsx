import { useEffect, useState } from 'react';
import { get, post, put, del } from '../api/client.js';
import Modal from './Modal.jsx';
import Loading from './Loading.jsx';

export default function Skills({ showToast }) {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({ skill_name: '', category: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await get('/skills');
      setSkills(data);
    } catch (error) {
      showToast?.(error.message || 'Error loading skills', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!form.skill_name) {
      showToast?.('Skill name is required', 'error');
      return;
    }
    try {
      const s = await post('/skills', form);
      setForm({ skill_name: '', category: '', description: '' });
      setSkills([s, ...skills]);
      setIsModalOpen(false);
      showToast?.('Skill created successfully', 'success');
    } catch (error) {
      showToast?.(error.message || 'Error creating skill', 'error');
    }
  };

  const update = async (s) => {
    try {
      await put(`/skills/${s.id}`, s);
      showToast?.('Skill updated successfully', 'success');
    } catch (error) {
      showToast?.(error.message || 'Error updating skill', 'error');
    }
  };

  const remove = async (id) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      await del(`/skills/${id}`);
      setSkills(skills.filter(x => x.id !== id));
      showToast?.('Skill deleted successfully', 'success');
    } catch (error) {
      showToast?.(error.message || 'Error deleting skill', 'error');
    }
  };

  const getCategoryBadge = (category) => {
    const badges = {
      'Programming Language': 'badge-primary',
      'Framework': 'badge-success',
      'Tool': 'badge-info',
      'Soft Skill': 'badge-warning',
      'Certification': 'badge-dark',
      'Language': 'badge-secondary',
      'Domain Knowledge': 'badge-info',
      'Other': 'badge-secondary',
    };
    return badges[category] || 'badge-secondary';
  };

  if (loading) {
    return <Loading message="Loading skills..." />;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Skills Catalog</h2>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">+ Add Skill</button>
        </div>

        {skills.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-text">No skills found</div>
            <div className="empty-state-subtext">Add your first skill to get started</div>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Skill Name</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {skills.map(s => (
                  <tr key={s.id}>
                    <td>
                      {editing?.id === s.id ? (
                        <input
                          className="form-input"
                          value={s.skill_name || ''}
                          onChange={e => setSkills(skills.map(x => x.id === s.id ? { ...x, skill_name: e.target.value } : x))}
                          onBlur={() => { update(skills.find(x => x.id === s.id)); setEditing(null); }}
                          autoFocus
                        />
                      ) : (
                        <span onClick={() => setEditing(s)} style={{ cursor: 'pointer', fontWeight: '600' }}>{s.skill_name}</span>
                      )}
                    </td>
                    <td>
                      {editing?.id === s.id ? (
                        <select
                          className="form-select"
                          value={s.category || ''}
                          onChange={e => setSkills(skills.map(x => x.id === s.id ? { ...x, category: e.target.value } : x))}
                          onBlur={() => { update(skills.find(x => x.id === s.id)); setEditing(null); }}
                        >
                          <option value="">Select Category</option>
                          <option>Programming Language</option>
                          <option>Framework</option>
                          <option>Tool</option>
                          <option>Soft Skill</option>
                        </select>
                      ) : (
                        s.category ? (
                          <span className={`badge ${getCategoryBadge(s.category)}`}>{s.category}</span>
                        ) : (
                          <span>—</span>
                        )
                      )}
                    </td>
                    <td>
                      {editing?.id === s.id ? (
                        <input
                          className="form-input"
                          value={s.description || ''}
                          onChange={e => setSkills(skills.map(x => x.id === s.id ? { ...x, description: e.target.value } : x))}
                          onBlur={() => { update(skills.find(x => x.id === s.id)); setEditing(null); }}
                        />
                      ) : (
                        <span onClick={() => setEditing(s)} style={{ cursor: 'pointer' }}>{s.description || '—'}</span>
                      )}
                    </td>
                    <td>
                      <button onClick={() => remove(s.id)} className="btn btn-sm btn-danger">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Skill">
        <div className="form-group">
          <label className="form-label">Skill Name *</label>
          <input
            className="form-input"
            placeholder="e.g., React, Python, AWS"
            value={form.skill_name}
            onChange={e => setForm({ ...form, skill_name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select Category</option>
            <option>Programming Language</option>
            <option>Framework</option>
            <option>Tool</option>
            <option>Soft Skill</option>
            <option>Certification</option>
            <option>Language</option>
            <option>Domain Knowledge</option>
            <option>Other</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-input"
            rows="3"
            placeholder="Optional description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="flex gap-2" style={{ marginTop: '1.5rem' }}>
          <button onClick={create} className="btn btn-primary">Create</button>
          <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
        </div>
      </Modal>
    </div>
  );
}
