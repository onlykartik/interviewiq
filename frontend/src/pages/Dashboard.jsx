import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardUpcoming, getDashboardStats } from '../api';

export default function Dashboard() {
  const [upcoming, setUpcoming] = useState([]);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadDashboard() {
      const upcomingRes = await getDashboardUpcoming();
      const statsRes = await getDashboardStats();
      
      setUpcoming(upcomingRes.data);
      setStats(statsRes.data);
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
          upcoming.map((i) => (
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
        <h2>Recommended for You</h2>

        {stats && stats.interviews === 0 ? (
          <p>
            Start by adding your first interview to unlock preparation
            recommendations.
          </p>
        ) : stats && stats.questions === 0 ? (
          <p>
            You have interviews logged. Add interview questions to improve your
            preparation.
          </p>
        ) : (
          <ul>
            <li>Revise Java Collections</li>
            <li>Practice SQL Joins</li>
            <li>Take Amazon Interview Quiz</li>
          </ul>
        )}
      </section>
    </div>
  );
}