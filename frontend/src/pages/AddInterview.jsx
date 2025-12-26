import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addInterview, addCompany, getCompanies } from '../api';
import Card from '../components/Card';
import { Building2, Briefcase, Calendar, CheckCircle2, ArrowLeft } from 'lucide-react';

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

        if (!role.trim()) return setError('Role is required');
        if (!date) return setError('Interview date is required');

        try {
        setLoading(true);
        let finalCompanyId = companyId;

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
        <div style={styles.container}>
        <style>{`
            .form-label { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: #475569; margin-bottom: 8px; }
            .input-field { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0; font-size: 15px; outline: none; transition: border 0.2s; box-sizing: border-box; margin-bottom: 16px; }
            .input-field:focus { border-color: #2563eb; }
            .save-btn { background: #2563eb; color: white; padding: 14px; border-radius: 12px; border: none; font-weight: 700; cursor: pointer; flex: 2; }
            .cancel-btn { background: #f1f5f9; color: #64748b; padding: 14px; border-radius: 12px; border: none; font-weight: 600; cursor: pointer; flex: 1; }
            .save-btn:disabled, .cancel-btn:disabled { opacity: 0.6; cursor: not-allowed; }
            @media (max-width: 600px) {
            .container { padding: 16px 16px 100px 16px !important; }
            }
        `}</style>

        <div style={styles.header}>
            <button onClick={() => navigate('/interviews')} style={styles.backBtn}>
            <ArrowLeft size={20} />
            </button>
            <h1 style={styles.title}>Add Interview</h1>
        </div>

        <Card>
            <form onSubmit={handleSubmit}>
            {/* COMPANY SECTION */}
            <label className="form-label"><Building2 size={16} /> Company</label>
            <select
                className="input-field"
                value={companyId}
                onChange={e => {
                setCompanyId(e.target.value);
                setNewCompany('');
                }}
            >
                <option value="">Select existing company</option>
                {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>

            <div style={styles.divider}>
                <span style={styles.dividerLine}></span>
                <span style={styles.dividerText}>OR</span>
                <span style={styles.dividerLine}></span>
            </div>

            <input
                className="input-field"
                placeholder="Type new company name"
                value={newCompany}
                onChange={e => {
                setNewCompany(e.target.value);
                setCompanyId('');
                }}
            />

            {/* ROLE SECTION */}
            <label className="form-label"><Briefcase size={16} /> Job Role</label>
            <input
                className="input-field"
                placeholder="e.g. Fullstack Developer"
                value={role}
                onChange={e => setRole(e.target.value)}
                required
            />

            {/* DATE SECTION */}
            <label className="form-label"><Calendar size={16} /> Interview Date</label>
            <input
                className="input-field"
                type="date"
                min={today}
                value={date}
                onChange={e => setDate(e.target.value)}
                required
            />

            {/* RESULT SECTION */}
            <label className="form-label"><CheckCircle2 size={16} /> Current Status</label>
            <select
                className="input-field"
                value={result}
                onChange={e => setResult(e.target.value)}
            >
                <option value="Pending">🕒 Pending</option>
                <option value="Selected">🎉 Selected</option>
                <option value="Rejected">❌ Rejected</option>
            </select>

            {/* ERROR MESSAGE */}
            {error && <div style={styles.errorBox}>{error}</div>}

            {/* ACTIONS */}
            <div style={styles.actions}>
                <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate('/interviews')}
                disabled={loading}
                >
                Cancel
                </button>

                <button type="submit" className="save-btn" disabled={loading}>
                {loading ? 'Saving...' : 'Save Interview'}
                </button>
            </div>
            </form>
        </Card>
        </div>
    );
}

const styles = {
    container: { maxWidth: '500px', margin: '0 auto', padding: '24px' },
    header: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' },
    backBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' },
    title: { fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: 0 },
    divider: { display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0 24px 0' },
    dividerLine: { flex: 1, height: '1px', background: '#e2e8f0' },
    dividerText: { fontSize: '11px', fontWeight: '700', color: '#94a3b8' },
    actions: { display: 'flex', gap: '12px', marginTop: '8px' },
    errorBox: { background: '#fef2f2', color: '#b91c1c', padding: '12px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px', fontWeight: '500', textAlign: 'center' }
};