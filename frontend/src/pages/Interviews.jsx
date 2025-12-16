import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInterviews } from '../api';

export default function Interviews() {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function loadInterviews() {
        try {
            const response = await getInterviews();
            setInterviews(response.data);
        } catch (err) {
            setError('Unable to load interviews');
        } finally {
            setLoading(false);
        }
        }

        loadInterviews();
    }, []);

    if (loading) return <p>Loading interviews...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
        {/* Header + CTA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>Interviews</h1>
            <button onClick={() => navigate('/interviews/new')}>
            + Add Interview
            </button>
        </div>

        {/* Empty state */}
        {interviews.length === 0 ? (
            <div style={{ marginTop: '20px' }}>
            <p>No interviews yet.</p>
            <button onClick={() => navigate('/interviews/add')}>
                Add your first interview
            </button>
            </div>
        ) : (
            <ul style={{ marginTop: '20px' }}>
            {interviews.map((i) => (
                <li
                key={i.id}
                style={{ cursor: 'pointer', marginBottom: '12px' }}
                onClick={() => navigate(`/interviews/${i.id}`)}
                >
                <strong>{i.company_name}</strong> – {i.role}
                <br />
                <small>{i.interview_date} | {i.result}</small>
                </li>
            ))}
            </ul>
        )}
        </div>
    );
}