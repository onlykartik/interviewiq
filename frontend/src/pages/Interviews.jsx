import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInterviews } from '../api';
import Card from '../components/Card';
import { Building2, Calendar, ChevronRight, Plus, Briefcase } from 'lucide-react';

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

    // Helper to get status colors
    const getStatusStyle = (status) => {
        const s = status?.toLowerCase();
        if (s === 'selected' || s === 'offered') return { bg: '#f0fdf4', color: '#166534', label: 'Selected' };
        if (s === 'rejected') return { bg: '#fef2f2', color: '#991b1b', label: 'Rejected' };
        return { bg: '#fff7ed', color: '#9a3412', label: status || 'Pending' }; // Default/Pending
    };

    if (loading) return <div style={styles.center}><p>Loading your journey...</p></div>;
    if (error) return <div style={styles.center}><p style={{color: '#ef4444'}}>{error}</p></div>;

    return (
        <div style={styles.container}>
            <style>{`
                .interview-row { transition: all 0.2s ease; border-radius: 12px; }
                .interview-row:hover { background: #f8fafc; transform: translateX(4px); }
                @media (max-width: 600px) {
                    .header-title { font-size: 24px !important; }
                    .add-btn-text { display: none; }
                }
            `}</style>

            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 className="header-title" style={styles.title}>Interviews</h1>
                    <p style={styles.subtitle}>Track your applications and progress</p>
                </div>
                <button onClick={() => navigate('/interviews/new')} style={styles.primaryButton}>
                    <Plus size={18} /> <span className="add-btn-text">Add Interview</span>
                </button>
            </div>

            {interviews.length === 0 ? (
                <Card>
                    <div style={styles.emptyContainer}>
                        <div style={styles.emptyIcon}><Briefcase size={32} color="#94a3b8" /></div>
                        <p style={styles.emptyText}>No interviews tracked yet.</p>
                        <button onClick={() => navigate('/interviews/new')} style={styles.secondaryButton}>
                            Add your first one
                        </button>
                    </div>
                </Card>
            ) : (
                <div style={styles.listContainer}>
                    {interviews.map((i) => {
                        const status = getStatusStyle(i.result);
                        return (
                            <div key={i.id} className="interview-row" style={styles.rowWrapper}>
                                <div style={styles.interviewCardInner} onClick={() => navigate(`/interviews/${i.id}`)}>
                                    <div style={styles.infoSide}>
                                        <div style={styles.companyRow}>
                                            <div style={styles.companyIcon}><Building2 size={16} /></div>
                                            <strong style={styles.companyName}>{i.company_name}</strong>
                                        </div>
                                        <div style={styles.roleName}>{i.role}</div>
                                        <div style={styles.metaRow}>
                                            <Calendar size={12} />
                                            <span>{new Date(i.interview_date).toLocaleDateString()}</span>
                                            <span style={styles.dot}>•</span>
                                            <span style={{
                                                ...styles.statusBadge,
                                                backgroundColor: status.bg,
                                                color: status.color
                                            }}>
                                                {status.label}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={styles.arrow}><ChevronRight size={20} /></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { maxWidth: '800px', margin: '0 auto', padding: '10px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    title: { fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: 0 },
    subtitle: { fontSize: '14px', color: '#64748b', marginTop: '4px' },
    primaryButton: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' },
    listContainer: { display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '100px' },
    rowWrapper: { background: 'white', border: '1px solid #f1f5f9', cursor: 'pointer' },
    interviewCardInner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' },
    companyRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' },
    companyIcon: { width: '28px', height: '28px', background: '#f8fafc', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' },
    companyName: { fontSize: '17px', color: '#1e293b' },
    roleName: { fontSize: '15px', color: '#475569', marginBottom: '12px', paddingLeft: '36px' },
    metaRow: { display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '13px', paddingLeft: '36px' },
    statusBadge: { padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.02em' },
    dot: { color: '#e2e8f0' },
    arrow: { color: '#cbd5e1' },
    emptyContainer: { textAlign: 'center', padding: '40px 0' },
    emptyIcon: { marginBottom: '16px' },
    emptyText: { color: '#64748b', marginBottom: '20px', fontSize: '16px' },
    secondaryButton: { background: 'none', border: '1px solid #e2e8f0', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
    center: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }
};