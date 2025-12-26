import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getDashboardUpcoming,
  getDashboardStats,
  getDashboardRecommendations,
  refreshRecommendations
} from '../api';
import Card from '../components/Card';
import { 
  Calendar, Lightbulb, RotateCw, Plus, ArrowRight, 
  Briefcase, HelpCircle, Building2, ChevronRight 
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  const [upcoming, setUpcoming] = useState([]);
  const [stats, setStats] = useState(null);
  const [recommendation, setRecommendation] = useState([]);
  const [remainingRefresh, setRemainingRefresh] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Original Logic (Untouched)
  async function handleRefresh() {
    if (refreshing || remainingRefresh === 0) return;
    setRefreshing(true);
    const res = await refreshRecommendations();
    if (!res.success) {
      alert(res.message || 'Refresh limit reached');
    } else {
      setRecommendation(res.data);
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
    <div className="dashboard-container" style={styles.container}>
      {/* Dynamic CSS for Responsiveness */}
      <style>{`
        .dashboard-container { padding: 24px; }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .main-content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        
        @media (max-width: 1024px) {
          .main-content-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .dashboard-container { padding: 16px; }
          .stats-grid { grid-template-columns: 1fr; gap: 12px; }
          .header-flex { flex-direction: column; align-items: flex-start; gap: 16px; }
          .add-btn { width: 100%; justify-content: center; }
        }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>

      <header className="header-flex">
        <div>
          <h1 style={styles.title}>Interview Prep</h1>
          <p style={styles.subtitle}>Track your progress and upcoming goals</p>
        </div>
        <button 
          className="add-btn" 
          style={styles.addBtn} 
          onClick={() => navigate('/interviews/new')}
        >
          <Plus size={18} /> Add Interview
        </button>
      </header>

      {/* Stats Cards */}
      <section className="stats-grid" style={{ marginBottom: '32px' }}>
        <StatCard icon={<Briefcase color="#2563eb"/>} label="Interviews" value={stats?.interviews} bg="#eff6ff" />
        <StatCard icon={<HelpCircle color="#16a34a"/>} label="Questions" value={stats?.questions} bg="#f0fdf4" />
        <StatCard icon={<Building2 color="#ea580c"/>} label="Companies" value={stats?.companies} bg="#fff7ed" />
      </section>

      <div className="main-content-grid">
        {/* Column 1: Upcoming */}
        <Card title={<div style={styles.cardTitle}><Calendar size={18}/> Upcoming</div>}>
          {upcoming.length === 0 ? (
            <div style={styles.emptyState}>
              <p>No interviews yet.</p>
              <button style={styles.linkText} onClick={() => navigate('/interviews/new')}>Schedule now</button>
            </div>
          ) : (
            upcoming.map(i => (
              <div key={i.id} style={styles.interviewItem}>
                <div>
                  <div style={{ fontWeight: '600' }}>{i.company_name}</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>{i.role}</div>
                </div>
                <div style={styles.dateBadge}>{i.interview_date}</div>
              </div>
            ))
          )}
        </Card>

        {/* Column 2: Recommendations */}
        <Card 
          title={
            <div style={styles.cardTitleBetween}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lightbulb size={18} color="#eab308"/> For You
              </div>
              <button 
                onClick={handleRefresh} 
                disabled={refreshing || remainingRefresh === 0}
                style={styles.refreshBtn}
              >
                <RotateCw size={14} className={refreshing ? 'animate-spin' : ''} />
                <span>{remainingRefresh} left</span>
              </button>
            </div>
          }
        >
          {stats?.questions === 0 ? (
            <p style={styles.emptyText}>Add questions to see personalized topics.</p>
          ) : (
            <>
              <div style={styles.tagWrapper}>
                {recommendation.map((topic, idx) => (
                  <span key={idx} style={styles.tag}>{topic}</span>
                ))}
              </div>
              {recommendation.length > 0 && (
                <button style={styles.quizBtn} onClick={() => navigate('/quiz/today')}>
                  Practice Today's Quiz <ChevronRight size={18} />
                </button>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

// Reusable Stat Component
function StatCard({ icon, label, value, bg }) {
  return (
    <div style={styles.statCard}>
      <div style={{ ...styles.iconBox, backgroundColor: bg }}>{icon}</div>
      <div>
        <div style={styles.statLabel}>{label}</div>
        <div style={styles.statValue}>{value || 0}</div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' },
  title: { fontSize: '28px', fontWeight: '800', margin: 0, color: '#0f172a' },
  subtitle: { color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' },
  addBtn: {
    display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px',
    borderRadius: '10px', border: 'none', background: '#2563eb', color: 'white',
    fontWeight: '600', cursor: 'pointer', transition: '0.2s'
  },
  statCard: {
    background: 'white', padding: '20px', borderRadius: '16px',
    display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid #f1f5f9'
  },
  iconBox: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  statLabel: { color: '#64748b', fontSize: '14px' },
  statValue: { fontSize: '24px', fontWeight: '700' },
  cardTitle: { display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700' },
  cardTitleBetween: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  interviewItem: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' },
  dateBadge: { background: '#f8fafc', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' },
  tagWrapper: { display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '15px 0' },
  tag: { background: '#eff6ff', color: '#2563eb', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' },
  quizBtn: {
    width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
    background: '#1e293b', color: 'white', fontWeight: '600', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
  },
  refreshBtn: { 
    display: 'flex', alignItems: 'center', gap: '5px', background: 'none', 
    border: '1px solid #e2e8f0', padding: '5px 10px', borderRadius: '8px', 
    fontSize: '12px', cursor: 'pointer' 
  },
  emptyState: { textAlign: 'center', padding: '20px' },
  linkText: { background: 'none', border: 'none', color: '#2563eb', fontWeight: '600', cursor: 'pointer' }
};