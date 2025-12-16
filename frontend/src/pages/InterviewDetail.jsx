import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getInterviewQuestions, addQuestion } from '../api';

export default function InterviewDetail() {
    const { id } = useParams();

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
        setQuestions(response.data);
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

        loadQuestions();
        } catch {
        alert('Failed to add question');
        }
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
        <h2>Interview Questions</h2>

        {/* ADD QUESTION FORM */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
            <textarea
            name="question_text"
            placeholder="Interview question (required)"
            value={form.question_text}
            onChange={handleChange}
            rows="3"
            style={{ width: '100%', marginBottom: '8px' }}
            />

            <input
            name="topic"
            placeholder="Topic (optional)"
            value={form.topic}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: '8px' }}
            />

            <input
            name="difficulty"
            placeholder="Difficulty (optional)"
            value={form.difficulty}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: '8px' }}
            />

            <input
            name="round"
            placeholder="Round (optional)"
            value={form.round}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: '8px' }}
            />

            <textarea
            name="user_answer"
            placeholder="Your answer (optional)"
            value={form.user_answer}
            onChange={handleChange}
            rows="2"
            style={{ width: '100%', marginBottom: '8px' }}
            />

            <button type="submit">Add Question</button>
        </form>

        {/* QUESTIONS LIST */}
        {questions.length === 0 && <p>No questions yet.</p>}

        <ul>
            {questions.map((q) => (
            <li key={q.id} style={{ marginBottom: '12px' }}>
                <strong>{q.question_text}</strong>
                <div style={{ fontSize: '14px', color: '#555' }}>
                {q.topic && <>Topic: {q.topic} · </>}
                {q.difficulty && <>Difficulty: {q.difficulty} · </>}
                {q.round && <>Round: {q.round}</>}
                </div>
                {q.user_answer && (
                <div>
                    <em>Your answer:</em> {q.user_answer}
                </div>
                )}
            </li>
            ))}
        </ul>
        </div>
    );
}
