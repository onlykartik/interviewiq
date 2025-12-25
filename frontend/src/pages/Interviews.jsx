import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInterviews } from '../api';
import Card from '../components/Card';

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
        <div
            style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
            }}
        >
            <h1>Interviews</h1>

            <button
            onClick={() => navigate('/interviews/new')}
            style={primaryButton}
            >
            + Add Interview
            </button>
        </div>

        {/* Empty state */}
        {interviews.length === 0 ? (
            <Card>
            <p>No interviews yet.</p>
            <button
                onClick={() => navigate('/interviews/new')}
                style={primaryButton}
            >
                Add your first interview
            </button>
            </Card>
        ) : (
            <div>
            {interviews.map((i) => (
                <Card key={i.id}>
                <div
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/interviews/${i.id}`)}
                >
                    <strong>{i.company_name}</strong>
                    <div>{i.role}</div>
                    <small>
                    {i.interview_date} | {i.result}
                    </small>
                </div>
                </Card>
            ))}
            </div>
        )}
        </div>
    );
}

/* Styles */
const primaryButton = {
    padding: '8px 14px',
    borderRadius: '6px',
    border: 'none',
    background: '#2563eb',
    color: '#fff',
    cursor: 'pointer'
    };