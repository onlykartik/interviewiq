import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getInterviewQuestions, addQuestion } from '../api';
import Card from '../components/Card';

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
        await addQuestion({
            interview_id: id,
            ...form
        });

        setForm({
            question_text: '',
            topic: '',
            difficulty: '',
            round: '',
            user_answer: ''
        });

        setShowForm(false);
        loadQuestions();
        } catch {
        alert('Failed to add question');
        }
    }

    if (loading) return <p>Loading interview questions...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
        <h1 style={{ marginBottom: '16px' }}>Interview Questions</h1>

        {/* TOGGLE BUTTON */}
        <button
            onClick={() => setShowForm(!showForm)}
            style={{ marginBottom: '16px' }}
        >
            {showForm ? '✖ Hide Question Form' : '+ Add Interview Question'}
        </button>

        {/* ADD QUESTION FORM */}
        {showForm && (
            <Card>
            <form onSubmit={handleSubmit}>
                <textarea
                name="question_text"
                placeholder="Interview question (required)"
                value={form.question_text}
                onChange={handleChange}
                rows="3"
                style={styles.input}
                />

                <input
                name="topic"
                placeholder="Topic (optional)"
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
                <option value="">Difficulty (optional)</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                </select>

                <input
                name="round"
                placeholder="Round (Technical / HR / Design)"
                value={form.round}
                onChange={handleChange}
                style={styles.input}
                />

                <textarea
                name="user_answer"
                placeholder="Your answer (optional)"
                value={form.user_answer}
                onChange={handleChange}
                rows="3"
                style={styles.input}
                />

                <button type="submit">Save Question</button>
            </form>
            </Card>
        )}

        {/* QUESTIONS LIST */}
        {questions.length === 0 ? (
            <Card>
            <p>No questions added yet.</p>
            <p>Add questions to unlock AI recommendations and quizzes.</p>
            </Card>
        ) : (
            questions.map((q, idx) => (
            <Card key={q.id}>
                <div style={styles.header}>
                <strong>Question {idx + 1}</strong>
                {q.difficulty && (
                    <span style={difficultyBadge(q.difficulty)}>
                    {q.difficulty}
                    </span>
                )}
                </div>

                <pre style={styles.text}>{q.question_text}</pre>

                {(q.topic || q.round) && (
                <div style={styles.meta}>
                    {q.topic && <span>Topic: {q.topic}</span>}
                    {q.round && <span>Round: {q.round}</span>}
                </div>
                )}

                {q.user_answer && (
                <div style={{ marginTop: '10px' }}>
                    <strong>Your Answer</strong>
                    <pre style={styles.answer}>{q.user_answer}</pre>
                </div>
                )}
            </Card>
            ))
        )}
        </div>
    );
    }

    /* ---------- Styles ---------- */

    const styles = {
    input: {
        width: '100%',
        marginBottom: '10px',
        padding: '8px'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px'
    },
    text: {
        whiteSpace: 'pre-wrap',
        background: '#f8fafc',
        padding: '8px',
        borderRadius: '6px'
    },
    answer: {
        whiteSpace: 'pre-wrap',
        background: '#eef2ff',
        padding: '8px',
        borderRadius: '6px',
        marginTop: '6px'
    },
    meta: {
        fontSize: '12px',
        color: '#64748b',
        display: 'flex',
        gap: '12px',
        marginTop: '6px'
    }
};

const difficultyBadge = (difficulty) => ({
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '12px',
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