import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInterviews,markInterviewAsPast } from '../api';
import Card from '../components/Card';

import {
    Building2,
    Calendar,
    ChevronRight,
    Plus,
    Briefcase,
    Clock,
    BookOpen,
    Sparkles
} from 'lucide-react';

export default function Interviews() {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function loadInterviews() {
            try {
                const response = await getInterviews();
                setInterviews(response.data || []);
            } catch {
                setError('Unable to load interviews');
            } finally {
                setLoading(false);
            }
        }
        loadInterviews();
    }, []);

    const upcomingInterviews = interviews.filter(i => i.interview_type === 'upcoming');
    const pastInterviews = interviews.filter(i => i.interview_type === 'past');

    const getStatusStyle = (status) => {
        const s = status?.toLowerCase();
        if (s === 'selected') return { bg: '#f0fdf4', color: '#166534', label: 'Selected' };
        if (s === 'rejected') return { bg: '#fef2f2', color: '#991b1b', label: 'Rejected' };
        return { bg: '#fff7ed', color: '#9a3412', label: status || 'Pending' };
    };

    function handleInterviewClick(interview) {
        if (interview.interview_type === 'upcoming') {
            navigate(`/interviews/${interview.id}/prepare`);
        } else {
            navigate(`/interviews/${interview.id}`);
        }
    }
    function isDatePassed(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
    return new Date(date) < today;
    }

    if (loading) return <div style={styles.center}><p>Loading your journey...</p></div>;
    if (error) return <div style={styles.center}><p style={{color: '#ef4444'}}>{error}</p></div>;

    return (
        <div className="interviews-container" style={styles.container}>
            <style>{`
                .interview-row { transition: all 0.2s ease; border: 1.5px solid #f1f5f9 !important; }
                .interview-row:hover { transform: translateX(4px); border-color: #2563eb !important; background: #f8fafc !important; }
                .add-btn { box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2); }
                @media (max-width: 600px) {
                    .title-text { font-size: 24px !important; }
                    .add-text { display: none; }
                }
            `}</style>

            <div style={styles.header}>
                <div>
                    <h1 className="title-text" style={styles.title}>Interviews</h1>
                    <p style={styles.subtitle}>Prepare for what’s coming. Learn from what’s done.</p>
                </div>
                <button onClick={() => navigate('/interviews/new')} className="add-btn" style={styles.primaryButton}>
                    <Plus size={18} /> <span className="add-text">Add Interview</span>
                </button>
            </div>

            {/* UPCOMING SECTION */}
            {upcomingInterviews.length > 0 && (
                <div style={styles.section}>
                    <SectionHeader
                        icon={<Clock size={18} color="#2563eb" />}
                        title="Upcoming Interviews"
                        subtitle="Prepare before the big day"
                    />
                    <div style={styles.list}>
                        {upcomingInterviews.map(renderInterview)}
                    </div>
                </div>
            )}

            {/* PAST SECTION */}
            {pastInterviews.length > 0 && (
                <div style={styles.section}>
                    <SectionHeader
                        icon={<BookOpen size={18} color="#166534" />}
                        title="Past Experiences"
                        subtitle="Review questions & improve"
                    />
                    <div style={styles.list}>
                        {pastInterviews.map(renderInterview)}
                    </div>
                </div>
            )}

            {interviews.length === 0 && (
                <Card>
                    <div style={styles.empty}>
                        <div style={styles.emptyIcon}><Briefcase size={40} color="#cbd5e1" /></div>
                        <h3 style={{ margin: '0 0 8px 0' }}>No interviews tracked</h3>
                        <p style={{ color: '#94a3b8', margin: '0 0 20px 0' }}>Start your journey by adding your first interview.</p>
                        <button onClick={() => navigate('/interviews/new')} style={styles.secondaryButton}>
                            <Sparkles size={16} /> Add First Interview
                        </button>
                    </div>
                </Card>
            )}
        </div>
    );

    function renderInterview(i) {
        const showMarkPast = i.interview_type === 'upcoming' && isDatePassed(i.interview_date);
        const status = getStatusStyle(i.result);

        return (
            <div
                key={i.id}
                className="interview-row"
                style={styles.row}
                onClick={() => handleInterviewClick(i)}
            >
                <div style={styles.rowLeft}>
                    <div style={styles.companyRow}>
                        <div style={styles.iconBox}><Building2 size={16} /></div>
                        <strong style={styles.companyName}>{i.company_name}</strong>
                    </div>

                    <div style={styles.roleText}>{i.role}</div>

                    <div style={styles.meta}>
                        <div style={styles.metaItem}>
                            <Calendar size={12} />
                            {new Date(i.interview_date).toLocaleDateString()}
                        </div>
                        <span style={{ ...styles.badge, background: status.bg, color: status.color }}>
                            {status.label}
                        </span>
                    </div>
                </div>
                {showMarkPast && (
                <button
                    onClick={(e) => {
                    e.stopPropagation();
                    markInterviewAsPast(i.id).then(() => {
                        window.location.reload();
                    });
                    }}
                    style={{
                    background: '#fee2e2',
                    color: '#991b1b',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                    }}
                >
                    Mark as Completed
                </button>
                )}
                <ChevronRight size={20} color="#cbd5e1" />
            </div>
        );
    }
}

function SectionHeader({ icon, title, subtitle }) {
    return (
        <div style={styles.sectionHeaderWrap}>
            <div style={styles.sectionTitleRow}>
                {icon}
                <h3 style={styles.sectionTitle}>{title}</h3>
            </div>
            <p style={styles.sectionSubtitle}>{subtitle}</p>
        </div>
    );
}

const styles = {
    container: { maxWidth: '750px', margin: '0 auto', padding: '20px 16px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' },
    title: { fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: 0 },
    subtitle: { color: '#64748b', fontSize: '15px', marginTop: '4px' },
    primaryButton: {
        display: 'flex', gap: '8px', alignItems: 'center',
        background: '#2563eb', color: '#fff',
        border: 'none', padding: '12px 20px',
        borderRadius: '12px', cursor: 'pointer', fontWeight: '700'
    },
    section: { marginBottom: '32px' },
    sectionHeaderWrap: { marginBottom: '16px' },
    sectionTitleRow: { display: 'flex', alignItems: 'center', gap: '8px' },
    sectionTitle: { margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' },
    sectionSubtitle: { margin: '4px 0 0', color: '#94a3b8', fontSize: '13px' },
    list: { display: 'flex', flexDirection: 'column', gap: '12px' },
    row: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px', borderRadius: '16px', cursor: 'pointer',
        background: '#fff'
    },
    companyRow: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '4px' },
    iconBox: { width: '28px', height: '28px', background: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' },
    companyName: { fontSize: '17px', color: '#0f172a' },
    roleText: { marginLeft: '38px', color: '#475569', fontSize: '15px', marginBottom: '10px' },
    meta: { display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '38px' },
    metaItem: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#94a3b8' },
    badge: { padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.03em' },
    empty: { textAlign: 'center', padding: '40px 20px' },
    emptyIcon: { marginBottom: '16px', display: 'flex', justifyContent: 'center' },
    secondaryButton: {
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        border: '1.5px solid #e2e8f0', background: '#fff',
        padding: '10px 24px', borderRadius: '10px',
        cursor: 'pointer', fontWeight: '600', color: '#475569'
    },
    center: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', color: '#64748b' }
};