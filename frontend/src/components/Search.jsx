import { useEffect, useState } from 'react';
import { get } from '../api/client.js';
import Loading from './Loading.jsx';

export default function Search({ showToast }) {
  const [skills, setSkills] = useState([]);
  const [filters, setFilters] = useState({ experienceLevel: '', skillId: '', minProficiency: '' });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const data = await get('/skills');
      setSkills(data);
    } catch (error) {
      showToast?.(error.message || 'Error loading skills', 'error');
    }
  };

  const runSearch = async () => {
    if (!filters.experienceLevel && !filters.skillId) {
      showToast?.('Please select at least one filter', 'error');
      return;
    }
    try {
      setLoading(true);
      setHasSearched(true);
      const res = await get('/matching/search/personnel', filters);
      setResults(res);
      if (res.length === 0) {
        showToast?.('No results found', 'warning');
      } else {
        showToast?.(`Found ${res.length} personnel`, 'success');
      }
    } catch (error) {
      showToast?.(error.message || 'Error searching personnel', 'error');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({ experienceLevel: '', skillId: '', minProficiency: '' });
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Advanced Search & Filtering</h2>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Experience Level</label>
            <select
              className="form-select"
              value={filters.experienceLevel}
              onChange={e => setFilters({ ...filters, experienceLevel: e.target.value })}
            >
              <option value="">All Levels</option>
              <option>Junior</option>
              <option>Mid-Level</option>
              <option>Senior</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Skill</label>
            <select
              className="form-select"
              value={filters.skillId}
              onChange={e => setFilters({ ...filters, skillId: e.target.value })}
            >
              <option value="">All Skills</option>
              {skills.map(s => <option key={s.id} value={s.id}>{s.skill_name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Minimum Proficiency</label>
            <select
              className="form-select"
              value={filters.minProficiency}
              onChange={e => setFilters({ ...filters, minProficiency: e.target.value })}
              disabled={!filters.skillId}
            >
              <option value="">Any Level</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Expert</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={runSearch} className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching...' : '🔍 Search'}
          </button>
          <button onClick={clearFilters} className="btn btn-secondary">Clear Filters</button>
        </div>
      </div>

      {loading ? (
        <Loading message="Searching personnel..." />
      ) : hasSearched && results.length > 0 ? (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Search Results ({results.length})</h3>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Experience</th>
                </tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: '600' }}>{r.name}</td>
                    <td>{r.email}</td>
                    <td>{r.role || '—'}</td>
                    <td>
                      <span className={`badge badge-${r.experience_level === 'Senior' ? 'success' : r.experience_level === 'Mid-Level' ? 'info' : 'warning'}`}>
                        {r.experience_level || '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : hasSearched ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-text">No results found</div>
            <div className="empty-state-subtext">Try adjusting your filters</div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-text">Ready to search</div>
            <div className="empty-state-subtext">Use the filters above to find personnel</div>
          </div>
        </div>
      )}
    </div>
  );
}
