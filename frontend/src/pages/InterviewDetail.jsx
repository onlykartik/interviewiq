import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { markInterviewAsPast } from '../api';

import {
  getInterviewQuestions,
  addQuestion,
  getInterviewById
} from '../api';
import Card from '../components/Card';
import {
  Plus,
  X,
  MessageSquare,
  Tag,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function InterviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    question_text: '',
    topic: '',
    difficulty: '',
    round: '',
    user_answer: ''
  });

  async function handleMarkAsPast() {
  try {
    await markInterviewAsPast(id);
    loadData(); // reload interview + questions
  } catch (err) {
    alert(err.message || 'Failed to update interview');
  }
}

  async function loadData() {
    try {
      const [qRes, iRes] = await Promise.all([
        getInterviewQuestions(id),
        getInterviewById(id)
      ]);

      setQuestions(qRes.data || []);
      setInterview(iRes.data);
    } catch {
      setError('Unable to load interview details');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.question_text.trim()) {
      alert('Question text is required');
      return;
    }

    try {
      await addQuestion({ interview_id: id, ...form });

      setForm({
        question_text: '',
        topic: '',
        difficulty: '',
        round: '',
        user_answer: ''
      });

      setShowForm(false);
      loadData();
    } catch {
      alert('Failed to add question');
    }
  }

  if (loading) return <div style={styles.statusMsg}>Loading interview…</div>;
  if (error) return <div style={styles.statusMsg}>{error}</div>;

  const isPastInterview = interview?.interview_type === 'past';

  return (
    <div style={styles.container}>
      <h1 style={styles.mainTitle}>Interview Details</h1>

      {/* ================= Interview Context ================= */}
      <Card>
        <strong style={styles.company}>{interview.company_name}</strong>
        <div style={styles.role}>{interview.role}</div>
        <div style={styles.meta}>
          Interview Date:{' '}
          {new Date(interview.interview_date).toLocaleDateString()}
          <span style={styles.dot}>•</span>
          <span style={styles.type}>
            {interview.interview_type === 'past'
              ? 'Past Interview'
              : 'Upcoming Interview'}
          </span>
        </div>
      </Card>

      {/* ================= UPCOMING REMINDER ================= */}
{!isPastInterview && (
  <Card>
    <div style={styles.infoBox}>
      <p style={{ fontWeight: 700 }}>
        This interview is upcoming.
      </p>

      <p style={styles.infoText}>
        Prepare with AI before the interview.
        <br />
        After the interview, mark it as completed to add real questions.
      </p>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button
          style={styles.primaryButton}
          onClick={() => navigate(`/interviews/${id}/prepare`)}
        >
          Prepare with AI <ArrowRight size={16} />
        </button>

        <button
          style={styles.secondaryButton}
          onClick={handleMarkAsPast}
        >
          Mark as Completed
        </button>
      </div>
    </div>
  </Card>
)}

      {/* ================= ADD QUESTION (PAST ONLY) ================= */}
      {isPastInterview && (
        <>
          <button
            onClick={() => setShowForm(!showForm)}
            style={styles.toggleBtn}
          >
            {showForm ? <X size={18} /> : <Plus size={18} />}
            {showForm ? 'Hide Form' : 'Add Question'}
          </button>

          {showForm && (
            <Card>
              <form onSubmit={handleSubmit}>
                <textarea
                  name="question_text"
                  placeholder="What did they ask?"
                  value={form.question_text}
                  onChange={handleChange}
                  rows="3"
                  style={styles.textarea}
                />

                <div style={styles.grid}>
                  <input
                    name="topic"
                    placeholder="Topic"
                    value={form.topic}
                    onChange={handleChange}
                    style={styles.input}
                  />

                  <select
                    name="difficulty"
                    value={form.difficulty}
                    onChange={handleChange}
                    style={styles.input}
                  >
                    <option value="">Difficulty</option>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>

                  <input
                    name="round"
                    placeholder="Round"
                    value={form.round}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

                <textarea
                  name="user_answer"
                  placeholder="Your answer / notes"
                  value={form.user_answer}
                  onChange={handleChange}
                  rows="3"
                  style={styles.textarea}
                />

                <button type="submit" style={styles.saveBtn}>
                  Save Question
                </button>
              </form>
            </Card>
          )}
        </>
      )}

      {/* ================= QUESTIONS LIST ================= */}
      <div style={{ marginTop: 24 }}>
        {questions.length === 0 ? (
          <Card>
            <div style={styles.empty}>
              <MessageSquare size={40} color="#cbd5e1" />
              <p style={{ fontWeight: 600 }}>No questions added yet.</p>
            </div>
          </Card>
        ) : (
          questions.map((q, idx) => (
            <Card key={q.id} style={{ marginBottom: 16 }}>
              <div style={styles.cardHeader}>
                <span>Question {idx + 1}</span>
                {q.difficulty && (
                  <span style={difficultyBadge(q.difficulty)}>
                    {q.difficulty}
                  </span>
                )}
              </div>

              <div style={styles.questionBox}>{q.question_text}</div>

              {(q.topic || q.round) && (
                <div style={styles.metaRow}>
                  {q.topic && (
                    <span style={styles.metaItem}>
                      <Tag size={12} /> {q.topic}
                    </span>
                  )}
                  {q.round && (
                    <span style={styles.metaItem}>
                      <Layers size={12} /> {q.round}
                    </span>
                  )}
                </div>
              )}

              {q.user_answer && (
                <div style={{ marginTop: 12 }}>
                  <div style={styles.answerLabel}>Your Answer</div>
                  <div style={styles.answerBox}>{q.user_answer}</div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

/* ================= Styles ================= */

const styles = {
  container: { maxWidth: 800, margin: '0 auto', padding: 24 },
  mainTitle: { fontSize: 26, fontWeight: 800, marginBottom: 20 },
  statusMsg: { textAlign: 'center', padding: 40, color: '#64748b' },

  company: { fontSize: 18, fontWeight: 700 },
  role: { color: '#475569', marginTop: 4 },
  meta: { fontSize: 13, color: '#64748b', marginTop: 6 },
  dot: { margin: '0 6px' },
  type: { fontWeight: 600 },

  infoBox: { textAlign: 'center', padding: 20 },
  infoText: { fontSize: 14, color: '#64748b', marginBottom: 12 },

  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: '#2563eb',
    color: '#fff',
    padding: '10px 16px',
    borderRadius: 10,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 700
  },

  toggleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    margin: '20px 0',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: 10,
    cursor: 'pointer'
  },

  input: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    border: '1px solid #e2e8f0'
  },

  textarea: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    border: '1px solid #e2e8f0',
    marginBottom: 12,
    fontFamily: 'inherit'
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    marginBottom: 12
  },

  saveBtn: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    border: 'none',
    background: '#1e293b',
    color: '#fff',
    fontWeight: 700
  },

  empty: { textAlign: 'center', padding: 20 },

  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 12
  },

  questionBox: {
    background: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    borderLeft: '4px solid #cbd5e1'
  },

  metaRow: { display: 'flex', gap: 12, marginTop: 12 },
  metaItem: {
    fontSize: 12,
    background: '#f1f5f9',
    padding: '4px 8px',
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    gap: 4
  },

  answerLabel: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 6
  },

  answerBox: {
    background: '#f5f7ff',
    padding: 12,
    borderRadius: 8,
    whiteSpace: 'pre-wrap'
  },

  secondaryButton: {
  padding: '10px 16px',
  borderRadius: 10,
  border: '1px solid #e2e8f0',
  background: '#fff',
  cursor: 'pointer',
  fontWeight: 600
}
};

const difficultyBadge = (difficulty) => ({
  padding: '4px 10px',
  borderRadius: '999px',
  fontSize: 11,
  fontWeight: 700,
  background:
    difficulty === 'Hard'
      ? '#fee2e2'
      : difficulty === 'Medium'
      ? '#e0f2fe'
      : '#dcfce7',
  color:
    difficulty === 'Hard'
      ? '#991b1b'
      : difficulty === 'Medium'
      ? '#075985'
      : '#166534'
});

