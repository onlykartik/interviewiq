import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addInterview, addCompany, getCompanies } from '../api';
import Card from '../components/Card';

export default function AddInterview() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [companyId, setCompanyId] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [role, setRole] = useState('');
  const [date, setDate] = useState('');
  const [result, setResult] = useState('Pending');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCompanies() {
      const res = await getCompanies();
      setCompanies(res.data || []);
    }
    loadCompanies();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!role.trim()) {
      return setError('Role is required');
    }

    if (!date) {
      return setError('Interview date is required');
    }

    try {
      setLoading(true);
      let finalCompanyId = companyId;

      // ➕ Add new company if selected
      if (!companyId && newCompany.trim()) {
        const res = await addCompany(newCompany.trim());
        finalCompanyId = res.data.id;
      }

      if (!finalCompanyId) {
        setLoading(false);
        return setError('Please select or add a company');
      }

      await addInterview({
        company_id: finalCompanyId,
        role: role.trim(),
        interview_date: date,
        result
      });

      navigate('/interviews');
    } catch {
      setError('Failed to add interview');
    } finally {
      setLoading(false);
    }
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <h1>Add Interview</h1>

      <Card>
        <form onSubmit={handleSubmit}>
          {/* COMPANY */}
          <label>Company</label>
          <select
            value={companyId}
            onChange={e => {
              setCompanyId(e.target.value);
              setNewCompany('');
            }}
            style={styles.input}
          >
            <option value="">Select existing company</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div style={styles.divider}>OR</div>

          <input
            placeholder="Add new company"
            value={newCompany}
            onChange={e => {
              setNewCompany(e.target.value);
              setCompanyId('');
            }}
            style={styles.input}
          />

          {/* ROLE */}
          <label>Role</label>
          <input
            placeholder="e.g. Backend Engineer"
            value={role}
            onChange={e => setRole(e.target.value)}
            style={styles.input}
            required
          />

          {/* DATE */}
          <label>Interview Date</label>
          <input
            type="date"
            min={today}
            value={date}
            onChange={e => setDate(e.target.value)}
            style={styles.input}
            required
          />

          {/* RESULT */}
          <label>Result</label>
          <select
            value={result}
            onChange={e => setResult(e.target.value)}
            style={styles.input}
          >
            <option value="Pending">Pending</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* ERROR */}
          {error && <p style={styles.error}>{error}</p>}

          {/* ACTIONS */}
          <div style={styles.actions}>
            <button
              type="button"
              onClick={() => navigate('/interviews')}
              disabled={loading}
            >
              Cancel
            </button>

            <button type="submit" disabled={loading}>
              {loading ? 'Saving…' : 'Save Interview'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

/* ---------- Styles ---------- */

const styles = {
  input: {
    width: '100%',
    padding: '8px',
    marginBottom: '12px'
  },
  divider: {
    textAlign: 'center',
    margin: '10px 0',
    color: '#666',
    fontSize: '12px'
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '16px'
  },
  error: {
    color: 'red',
    marginTop: '8px'
  }
};