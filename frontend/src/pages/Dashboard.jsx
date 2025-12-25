import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getDashboardUpcoming,
  getDashboardStats,
  getDashboardRecommendations,
  refreshRecommendations
} from '../api';
import Card from '../components/Card';

export default function Dashboard() {
  const navigate = useNavigate();

  const [upcoming, setUpcoming] = useState([]);
  const [stats, setStats] = useState(null);
  const [recommendation, setRecommendation] = useState([]);
  const [remainingRefresh, setRemainingRefresh] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh() {
    if (refreshing || remainingRefresh === 0) return;

    setRefreshing(true);

    const res = await refreshRecommendations();

    if (!res.success) {
      alert(res.message || 'Refresh limit reached');
    } else {
      setRecommendation(res.data);          // new topics
      setRemainingRefresh(Math.max(0, res.remaining));
    }

    setRefreshing(false);
  }

useEffect(() => {
  async function loadDashboard() {
    const upcomingRes = await getDashboardUpcoming();
    const statsRes = await getDashboardStats();
    const recRes = await getDashboardRecommendations();

    setUpcoming(upcomingRes.data);
    setStats(statsRes.data);
    setRecommendation(recRes.data || []);
    setRemainingRefresh(recRes.remaining ?? 0);
  }

  loadDashboard();
}, []);

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Upcoming Interviews */}
<Card title="Upcoming Interviews">
  {upcoming.length === 0 ? (
    <p>
      No upcoming interviews.{' '}
      <button onClick={() => navigate('/interviews/new')}>
        Add Interview
      </button>
    </p>
  ) : (
    upcoming.map(i => (
      <div
        key={i.id}
        style={{
          marginBottom: '10px',
          paddingBottom: '6px',
          borderBottom: '1px solid #eee'
        }}
      >
        <strong>{i.company_name}</strong> – {i.role}
        <br />
        <small>{i.interview_date}</small>
      </div>
    ))
  )}
</Card>

      {/* Stats */}
<Card title="Your Stats">
  {stats && (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <div style={statBox}>
        <div style={statValue}>{stats.interviews}</div>
        <div>Interviews</div>
      </div>
      <div style={statBox}>
        <div style={statValue}>{stats.questions}</div>
        <div>Questions</div>
      </div>
      <div style={statBox}>
        <div style={statValue}>{stats.companies}</div>
        <div>Companies</div>
      </div>
    </div>
  )}
</Card>

      {/* Recommendations */}
<Card
  title={
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      Recommended for You
      <button
        onClick={handleRefresh}
        disabled={refreshing || remainingRefresh === 0}
        title="Refresh recommendations"
        style={{
          cursor:
            refreshing || remainingRefresh === 0
              ? 'not-allowed'
              : 'pointer'
        }}
      >
        {refreshing ? '⏳' : '🔄'}
      </button>
    </div>
  }
>
  <small>Refreshes left today: {remainingRefresh}</small>

  {stats && stats.questions === 0 && (
    <p>Add interview questions to unlock recommendations.</p>
  )}

  {recommendation.length > 0 && (
    <>
      <ul>
        {recommendation.map((topic, idx) => (
          <li key={idx}>{topic}</li>
        ))}
      </ul>

      <button
        style={{
          marginTop: '12px',
          padding: '8px 14px',
          borderRadius: '6px',
          border: 'none',
          background: '#2563eb',
          color: '#fff',
          cursor: 'pointer'
        }}
        onClick={() => navigate('/quiz/today')}
      >
        Take Today’s Quiz
      </button>
    </>
  )}
</Card>
    </div>
  );
}

const statBox = {
  flex: '1',
  minWidth: '90px',
  padding: '12px',
  background: '#f8fafc',
  borderRadius: '6px',
  textAlign: 'center'
};

const statValue = {
  fontSize: '20px',
  fontWeight: 'bold'
};