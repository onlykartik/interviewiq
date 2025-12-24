import { useEffect, useState } from 'react';
import { getTodayQuiz } from '../api';

export default function Quiz() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadQuiz() {
        const res = await getTodayQuiz();
        setQuestions(res.data || []);
        setLoading(false);
        }
        loadQuiz();
    }, []);

    if (loading) return <p>Loading quiz…</p>;

    return (
        <div>
        <h1>Today’s Quiz</h1>

        {questions.map((q, idx) => (
            <div key={idx} style={{ marginBottom: '20px' }}>
            <strong>{idx + 1}. {q.question}</strong>
            <ul>
                {q.options.map((opt, i) => (
                <li key={i}>{opt}</li>
                ))}
            </ul>
            </div>
        ))}
        </div>
    );
}