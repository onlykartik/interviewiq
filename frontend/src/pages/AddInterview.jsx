import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addInterview, addCompany, getCompanies } from '../api';
import Card from '../components/Card';
import {
  Building2,
  Briefcase,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  Clock,
  BookOpen,
  PlusCircle,
  Sparkles
} from 'lucide-react';

export default function AddInterview() {
  const navigate = useNavigate();

  const [interviewType, setInterviewType] = useState(null); // 'upcoming' | 'past'
  const [companies, setCompanies] = useState([]);
  const [companyId, setCompanyId] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [role, setRole] = useState('');
  const [date, setDate] = useState('');
  const [result, setResult] = useState('');
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

    if (!interviewType) return setError('Select interview type');
    if (!role.trim()) return setError('Role is required');
    if (!date) return setError('Interview date is required');
    if (interviewType === 'past' && !result)
      return setError('Result is required for past interviews');

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
        interview_type: interviewType,
        result: interviewType === 'past' ? result : null
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
    <div className="interviews-container" style={styles.container}>
      <style>{`
        .choice-card { transition: all 0.2s ease; border: 2px solid #f1f5f9 !important; }
        .choice-card:hover { border-color: #2563eb !important; transform: translateY(-2px); background: #f8fafc !important; }
        .choice-card.active { border-color: #2563eb !important; background: #eff6ff !important; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1); }
        
        .form-input { width: 100%; padding: 12px 14px; border-radius: 12px; border: 1.5px solid #e2e8f0; transition: 0.2s; font-size: 15px; box-sizing: border-box; background: #fff; }
        .form-input:focus { border-color: #2563eb; outline: none; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.05); }
        
        @media (max-width: 600px) {
          .choice-grid { grid-template-columns: 1fr !important; }
          .title-text { font-size: 22px !important; }
        }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <button
          onClick={() => interviewType ? setInterviewType(null) : navigate('/interviews')}
          style={styles.backBtn}
        >
          <ArrowLeft size={22} />
        </button>
        <div>
          <h1 className="title-text" style={styles.title}>Add Interview</h1>
          <p style={styles.subtitle}>Track your career progress</p>
        </div>
      </div>

      {/* STEP 1: Selection */}
      {!interviewType && (
        <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
          <h3 style={styles.stepTitle}>What kind of interview is this?</h3>
          <div className="choice-grid" style={styles.choiceGrid}>
            <button className="choice-card" style={styles.choiceCard} onClick={() => setInterviewType('upcoming')}>
              <div style={{ ...styles.iconCircle, background: '#eff6ff', color: '#2563eb' }}><Clock size={24} /></div>
              <div style={styles.choiceTextWrapper}>
                <strong style={styles.choiceTitle}>Upcoming</strong>
                <p style={styles.choiceDesc}>Set reminders and prepare early</p>
              </div>
            </button>

            <button className="choice-card" style={styles.choiceCard} onClick={() => setInterviewType('past')}>
              <div style={{ ...styles.iconCircle, background: '#f0fdf4', color: '#166534' }}><BookOpen size={24} /></div>
              <div style={styles.choiceTextWrapper}>
                <strong style={styles.choiceTitle}>Past Experience</strong>
                <p style={styles.choiceDesc}>Log questions and results</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Form */}
      {interviewType && (
        <Card style={{ padding: '24px', animation: 'fadeIn 0.4s ease-out' }}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.badgeRow}>
              <span style={{ ...styles.typeBadge, background: interviewType === 'upcoming' ? '#eff6ff' : '#f0fdf4', color: interviewType === 'upcoming' ? '#2563eb' : '#166534' }}>
                {interviewType === 'upcoming' ? <Clock size={12} /> : <BookOpen size={12} />}
                {interviewType.toUpperCase()}
              </span>
            </div>

            {/* Company Selection */}
            <div style={styles.inputGroup}>
              <label style={styles.label}><Building2 size={16} /> Company</label>
              <select className="form-input" value={companyId} onChange={e => { setCompanyId(e.target.value); setNewCompany(''); }}>
                <option value="">Select an existing company</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              
              <div style={styles.divider}>
                <span style={styles.dividerLine} />
                <span style={styles.dividerText}>OR ADD NEW</span>
                <span style={styles.dividerLine} />
              </div>

              <div style={{ position: 'relative' }}>
                <input className="form-input" style={{ paddingLeft: '40px' }} placeholder="Enter company name" value={newCompany} onChange={e => { setNewCompany(e.target.value); setCompanyId(''); }} />
                <PlusCircle size={18} style={{ position: 'absolute', left: '14px', top: '13px', color: '#94a3b8' }} />
              </div>
            </div>

            {/* Role */}
            <div style={styles.inputGroup}>
              <label style={styles.label}><Briefcase size={16} /> Job Role</label>
              <input className="form-input" placeholder="e.g. Software Engineer" value={role} onChange={e => setRole(e.target.value)} />
            </div>

            {/* Date */}
            <div style={styles.inputGroup}>
              <label style={styles.label}><Calendar size={16} /> Date</label>
              <input className="form-input" type="date" min={interviewType === 'upcoming' ? today : undefined} max={interviewType === 'past' ? today : undefined} value={date} onChange={e => setDate(e.target.value)} />
            </div>

            {/* Result (Past only) */}
            {interviewType === 'past' && (
              <div style={styles.inputGroup}>
                <label style={styles.label}><CheckCircle2 size={16} /> Status</label>
                <select className="form-input" value={result} onChange={e => setResult(e.target.value)}>
                  <option value="">Select outcome</option>
                  <option value="Selected">🎉 Selected / Offered</option>
                  <option value="Rejected">❌ Rejected</option>
                  <option value="Pending">⏳ Pending Result</option>
                </select>
              </div>
            )}

            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.actions}>
              <button type="button" style={styles.secondaryBtn} onClick={() => setInterviewType(null)}>Back</button>
              <button type="submit" style={styles.primaryBtn} disabled={loading}>
                {loading ? 'Saving...' : <><Sparkles size={18} /> Save Interview</>}
              </button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: 520, margin: '0 auto', padding: '40px 20px' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' },
  backBtn: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '8px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
  title: { fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0 },
  subtitle: { fontSize: '14px', color: '#64748b', marginTop: '2px' },
  stepTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '20px', textAlign: 'center' },
  choiceGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  choiceCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px', borderRadius: '16px', background: '#fff', cursor: 'pointer', textAlign: 'center', outline: 'none' },
  iconCircle: { width: '52px', height: '52px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' },
  choiceTextWrapper: { display: 'flex', flexDirection: 'column', gap: '4px' },
  choiceTitle: { fontSize: '16px', color: '#0f172a' },
  choiceDesc: { fontSize: '12px', color: '#94a3b8', lineHeight: '1.4' },
  badgeRow: { marginBottom: '20px' },
  typeBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '6px', letterSpacing: '0.05em' },
  form: { display: 'flex', flexDirection: 'column', gap: '4px' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.02em' },
  divider: { display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0' },
  dividerLine: { flex: 1, height: '1.5px', background: '#f1f5f9' },
  dividerText: { fontSize: '10px', fontWeight: '800', color: '#cbd5e1' },
  actions: { display: 'flex', gap: '12px', marginTop: '12px' },
  primaryBtn: { flex: 2, background: '#2563eb', color: '#fff', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' },
  secondaryBtn: { flex: 1, background: '#fff', color: '#64748b', padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontWeight: '600', cursor: 'pointer' },
  error: { background: '#fef2f2', color: '#b91c1c', padding: '12px', borderRadius: '10px', fontSize: '14px', marginBottom: '16px', textAlign: 'center', fontWeight: '500', border: '1px solid #fee2e2' }
};