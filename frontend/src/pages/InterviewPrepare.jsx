import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getInterviewPreparation,
  generateInterviewPreparation,
  getInterviewById
} from '../api';
import Card from '../components/Card';

export default function InterviewPrepare() {
  const { id } = useParams();

  /* ---------------- Interview Context ---------------- */
  const [interview, setInterview] = useState(null);

  /* ---------------- Preparation Form ---------------- */
  const [form, setForm] = useState({
    experience_level: '',
    location: '',
    job_description: ''
  });

  /* ---------------- AI Questions ---------------- */
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- Load interview details ---------------- */
  useEffect(() => {
    async function loadInterview() {
      const res = await getInterviewById(id);
      setInterview(res.data);
    }
    loadInterview();
  }, [id]);

  /* ---------------- Load existing AI prep ---------------- */
  useEffect(() => {
    async function loadExisting() {
      const res = await getInterviewPreparation(id);
      if (res.data?.ai_questions) {
        setQuestions(res.data.ai_questions);
      }
    }
    loadExisting();
  }, [id]);

  /* ---------------- Persist form locally ---------------- */
  useEffect(() => {
    const saved = localStorage.getItem(`prep_${id}`);
    if (saved) {
      setForm(JSON.parse(saved));
    }
  }, [id]);

  useEffect(() => {
    localStorage.setItem(`prep_${id}`, JSON.stringify(form));
  }, [form, id]);

  /* ---------------- Generate Questions ---------------- */
  async function handleGenerate() {
    if (!form.job_description.trim()) {
      alert('Please paste a job description');
      return;
    }

    setLoading(true);
    const res = await generateInterviewPreparation(id, form);
    setQuestions(res.data.ai_questions || []);
    setLoading(false);
  }

  if (!interview) {
    return <div style={styles.center}>Loading interview details…</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Prepare for Interview</h1>

      {/* ================= Interview Context ================= */}
      <Card>
        <strong style={styles.company}>{interview.company_name}</strong>
        <div style={styles.role}>{interview.role}</div>
        <div style={styles.date}>
          Interview Date:{' '}
          {new Date(interview.interview_date).toLocaleDateString()}
        </div>
      </Card>

      {/* ================= Preparation Form ================= */}
      <Card>
        <h3 style={styles.sectionTitle}>Preparation Details</h3>

        <select
          style={styles.input}
          value={form.experience_level}
          onChange={e =>
            setForm({ ...form, experience_level: e.target.value })
          }
        >
          <option value="">Experience Level</option>
          <option>Fresher</option>
          <option>1–3 years</option>
          <option>3–5 years</option>
          <option>5+ years</option>
        </select>

        <input
          style={styles.input}
          placeholder="Preferred location (optional)"
          value={form.location}
          onChange={e => setForm({ ...form, location: e.target.value })}
        />

        <textarea
          style={styles.textarea}
          placeholder="Paste the job description here"
          rows={6}
          value={form.job_description}
          onChange={e =>
            setForm({ ...form, job_description: e.target.value })
          }
        />

        <button
          style={styles.primaryButton}
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? 'Generating…' : 'Generate Interview Questions'}
        </button>
      </Card>

      {/* ================= AI Questions ================= */}
      {questions.length > 0 && (
        <Card>
<div className="card" style={styles.statsCard}>
  <h3 style={styles.sectionTitle}>Likely Interview Questions</h3>
  <p style={styles.statsSubtitle}>Historical data analysis for this role</p>

  <div style={styles.statItem}>
    <div style={styles.statHeader}>
      <span style={styles.statLabel}>Same Question Wording</span>
      <span style={{...styles.statValue, color: '#6366f1'}}>5–15%</span>
    </div>
    <div style={styles.progressBase}>
      <div style={{...styles.progressFill, width: '15%', background: '#6366f1'}} />
    </div>
  </div>

  <div style={styles.statItem}>
    <div style={styles.statHeader}>
      <span style={styles.statLabel}>Same Concept / Topic</span>
      <span style={{...styles.statValue, color: '#2563eb'}}>60–80%</span>
    </div>
    <div style={styles.progressBase}>
      <div style={{...styles.progressFill, width: '80%', background: '#2563eb'}} />
    </div>
  </div>
</div>          

          <ol style={styles.questionList}>
            {questions.map((q, i) => (
              <li key={i} style={styles.questionItem}>
                {q}
              </li>
            ))}
          </ol>
        </Card>
      )}
    </div>
  );
}

/* ================= Styles ================= */

const styles = {
  container: { maxWidth: 800, margin: '0 auto', padding: 24 },
  title: { fontSize: 28, fontWeight: 800, marginBottom: 16 },
  center: { textAlign: 'center', padding: 40 },

  company: { fontSize: 18, fontWeight: 700 },
  role: { color: '#475569', marginTop: 4 },
  date: { fontSize: 13, color: '#64748b', marginTop: 4 },

  sectionTitle: { fontSize: 16, fontWeight: 700, marginBottom: 12 },

  input: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    border: '1px solid #e2e8f0',
    marginBottom: 12,
    fontSize: 14
  },

  textarea: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    border: '1px solid #e2e8f0',
    marginBottom: 16,
    fontSize: 14,
    fontFamily: 'inherit'
  },

  primaryButton: {
    background: '#2563eb',
    color: '#fff',
    padding: '12px 18px',
    borderRadius: 10,
    border: 'none',
    fontWeight: 700,
    cursor: 'pointer'
  },

  questionList: { paddingLeft: 18 },
  questionItem: {
    marginBottom: 10,
    lineHeight: 1.5,
    color: '#1e293b'
  },

  statsCard: {
    padding: '24px',
    background: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    textAlign: 'left',
    marginTop: '20px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 4px 0'
  },
  statsSubtitle: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '24px'
  },
  statItem: {
    marginBottom: '20px'
  },
  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  statLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569'
  },
  statValue: {
    fontSize: '15px',
    fontWeight: '700'
  },
  progressBase: {
    width: '100%',
    height: '8px',
    background: '#f1f5f9',
    borderRadius: '10px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: '10px',
    transition: 'width 1s ease-in-out'
  }
};