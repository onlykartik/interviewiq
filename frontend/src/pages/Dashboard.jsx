import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getDashboardUpcoming,
  getDashboardStats,
  getDashboardRecommendations,
  refreshRecommendations
} from '../api';

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
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>

      {/* Upcoming Interviews */}
      <section style={{ marginTop: '30px' }}>
        <h2>Upcoming Interviews</h2>

        {upcoming.length === 0 ? (
          <p>
            No upcoming interviews.{' '}
            <button onClick={() => navigate('/interviews/new')}>
              Add Interview
            </button>
          </p>
        ) : (
          upcoming.map(i => (
            <div key={i.id} style={{ marginBottom: '10px' }}>
              <strong>{i.company_name}</strong> – {i.role}
              <br />
              <small>{i.interview_date}</small>
            </div>
          ))
        )}
      </section>

      {/* Stats */}
      <section style={{ marginTop: '30px' }}>
        <h2>Your Stats</h2>
        {stats && (
          <div style={{ display: 'flex', gap: '20px' }}>
            <div>Interviews: {stats.interviews}</div>
            <div>Questions: {stats.questions}</div>
            <div>Companies: {stats.companies}</div>
          </div>
        )}
      </section>

      {/* Recommendations */}
      <section style={{ marginTop: '30px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
        </h2>

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

            <button onClick={() => navigate('/quiz/today')}>
              Take Today’s Quiz
            </button>
          </>
        )}
      </section>
    </div>
  );
}