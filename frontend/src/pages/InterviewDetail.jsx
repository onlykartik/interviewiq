import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getInterviewQuestions, addQuestion } from '../api';
import Card from '../components/Card';
import { Plus, X, MessageSquare, Tag, BarChart, Layers } from 'lucide-react';

export default function InterviewDetail() {
    const { id } = useParams();

    const [questions, setQuestions] = useState([]);
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

    async function loadQuestions() {
        try {
            const response = await getInterviewQuestions(id);
            setQuestions(response.data || []);
        } catch {
            setError('Unable to load questions');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadQuestions();
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
            setForm({ question_text: '', topic: '', difficulty: '', round: '', user_answer: '' });
            setShowForm(false);
            loadQuestions();
        } catch {
            alert('Failed to add question');
        }
    }

    if (loading) return <div style={styles.statusMsg}>Loading interview questions...</div>;
    if (error) return <div style={styles.statusMsg}>{error}</div>;

    return (
        <div style={styles.container}>
            <style>{`
                .btn-toggle {
                    display: flex; align-items: center; gap: 8px;
                    padding: 10px 16px; border-radius: 10px; border: none;
                    background: #2563eb; color: white; font-weight: 600;
                    cursor: pointer; margin-bottom: 20px; transition: 0.2s;
                }
                .btn-toggle:active { transform: scale(0.98); }
                .form-grid {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;
                }
                .save-btn {
                    width: 100%; padding: 12px; border-radius: 8px; border: none;
                    background: #1e293b; color: white; font-weight: 600; cursor: pointer;
                }
                @media (max-width: 600px) {
                    .form-grid { grid-template-columns: 1fr; }
                    .container { padding: 16px 16px 100px 16px !important; }
                }
            `}</style>

            <h1 style={styles.mainTitle}>Interview Questions</h1>

            {/* TOGGLE BUTTON */}
            <button onClick={() => setShowForm(!showForm)} className="btn-toggle">
                {showForm ? <X size={18} /> : <Plus size={18} />}
                {showForm ? 'Hide Form' : 'Add Question'}
            </button>

            {/* ADD QUESTION FORM */}
            {showForm && (
                <div style={{ marginBottom: '24px' }}>
                    <Card>
                        <form onSubmit={handleSubmit}>
                            <textarea
                                name="question_text"
                                placeholder="What did they ask? (required)"
                                value={form.question_text}
                                onChange={handleChange}
                                rows="3"
                                style={styles.textarea}
                            />

                            <div className="form-grid">
                                <input
                                    name="topic"
                                    placeholder="Topic (e.g. React, Java)"
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
                                    <option value="">Select Difficulty</option>
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                                <input
                                    name="round"
                                    placeholder="Round (e.g. Technical)"
                                    value={form.round}
                                    onChange={handleChange}
                                    style={styles.input}
                                />
                            </div>

                            <textarea
                                name="user_answer"
                                placeholder="Your answer or notes (optional)"
                                value={form.user_answer}
                                onChange={handleChange}
                                rows="3"
                                style={styles.textarea}
                            />

                            <button type="submit" className="save-btn">Save Question</button>
                        </form>
                    </Card>
                </div>
            )}

            {/* QUESTIONS LIST */}
            <div style={styles.list}>
                {questions.length === 0 ? (
                    <Card>
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <MessageSquare size={40} color="#cbd5e1" style={{ marginBottom: '12px' }} />
                            <p style={{ fontWeight: '600', color: '#475569' }}>No questions added yet.</p>
                            <p style={{ fontSize: '14px', color: '#64748b' }}>Add questions to unlock AI recommendations.</p>
                        </div>
                    </Card>
                ) : (
                    questions.map((q, idx) => (
                        <div key={q.id} style={{ marginBottom: '16px' }}>
                            <Card>
                                <div style={styles.cardHeader}>
                                    <span style={styles.questionNum}>Question {idx + 1}</span>
                                    {q.difficulty && (
                                        <span style={difficultyBadge(q.difficulty)}>
                                            {q.difficulty}
                                        </span>
                                    )}
                                </div>

                                <div style={styles.questionBox}>
                                    {q.question_text}
                                </div>

                                {(q.topic || q.round) && (
                                    <div style={styles.metaRow}>
                                        {q.topic && <span style={styles.metaItem}><Tag size={12}/> {q.topic}</span>}
                                        {q.round && <span style={styles.metaItem}><Layers size={12}/> {q.round}</span>}
                                    </div>
                                )}

                                {q.user_answer && (
                                    <div style={{ marginTop: '16px' }}>
                                        <div style={styles.answerLabel}>Your Answer</div>
                                        <div style={styles.answerBox}>{q.user_answer}</div>
                                    </div>
                                )}
                            </Card>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: '800px', margin: '0 auto', padding: '24px' },
    mainTitle: { fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '20px' },
    statusMsg: { textAlign: 'center', padding: '40px', color: '#64748b' },
    input: {
        width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0',
        fontSize: '14px', outline: 'none', boxSizing: 'border-box'
    },
    textarea: {
        width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0',
        fontSize: '14px', outline: 'none', marginBottom: '12px', boxSizing: 'border-box',
        fontFamily: 'inherit'
    },
    list: { display: 'flex', flexDirection: 'column' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
    questionNum: { fontSize: '14px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' },
    questionBox: {
        fontSize: '16px', fontWeight: '500', color: '#1e293b', lineHeight: '1.5',
        background: '#f8fafc', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #cbd5e1'
    },
    answerLabel: { fontSize: '13px', fontWeight: '700', color: '#4f46e5', marginBottom: '6px', textTransform: 'uppercase' },
    answerBox: {
        fontSize: '14px', color: '#334155', background: '#f5f7ff', padding: '12px',
        borderRadius: '8px', borderLeft: '4px solid #818cf8', whiteSpace: 'pre-wrap'
    },
    metaRow: { display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px' },
    metaItem: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }
};

const difficultyBadge = (difficulty) => ({
    padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '700',
    background: difficulty === 'Hard' ? '#fee2e2' : difficulty === 'Medium' ? '#e0f2fe' : '#dcfce7',
    color: difficulty === 'Hard' ? '#991b1b' : difficulty === 'Medium' ? '#075985' : '#166534'
});