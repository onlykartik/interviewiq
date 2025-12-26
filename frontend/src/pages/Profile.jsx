import { useEffect, useState } from 'react';
import { getMe, updateName, getUserProfile, saveUserProfile } from '../api';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Briefcase, GraduationCap, Target, Save, LogOut, CheckCircle2 } from 'lucide-react';

const ROLES = ['Backend Engineer', 'Frontend Engineer', 'Full Stack Engineer', 'Data Scientist', 'ML Engineer', 'DevOps Engineer', 'Cloud Engineer', 'Other'];
const EXPERIENCE = ['Fresher', '1–3 years', '3–5 years', '5-10 years', '10+'];
const DOMAINS = ['Backend', 'Frontend', 'System Design', 'Cloud', 'Databases', 'Data Structures', 'Machine Learning'];

export default function Profile() {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('');
  const [domains, setDomains] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const me = await getMe();
      setUser(me.data);
      setName(me.data.name || '');
      const profileRes = await getUserProfile();
      if (profileRes?.data) {
        setRole(profileRes.data.primary_role || '');
        setExperience(profileRes.data.experience_level || '');
        setDomains(profileRes.data.preferred_domains || []);
      }
    }
    load();
  }, []);

  function toggleDomain(domain) {
    setDomains(prev => prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain]);
  }

  async function saveProfile() {
    setSaving(true);
    try {
      await updateName(name);
      await saveUserProfile({ primary_role: role, experience_level: experience, preferred_domains: domains });
      alert('Profile updated successfully');
    } finally {
      setSaving(false);
    }
  }

  if (!user) return <div style={styles.center}><p>Loading your profile...</p></div>;

  return (
    <div className="profile-container" style={styles.container}>
      <style>{`
        .profile-input { width: 100%; padding: 12px; border-radius: 10px; border: 1.5px solid #e2e8f0; font-size: 14px; margin-top: 6px; transition: 0.2s; box-sizing: border-box; }
        .profile-input:focus { border-color: #2563eb; outline: none; background: #fff; }
        .domain-chip { padding: 8px 16px; border-radius: 20px; border: 1.5px solid #e2e8f0; background: #fff; cursor: pointer; font-size: 13px; font-weight: 500; transition: 0.2s; display: flex; align-items: center; gap: 6px; }
        .domain-chip.active { background: #eff6ff; border-color: #2563eb; color: #2563eb; }
        .section-card { animation: fadeIn 0.5s ease-out; }
      `}</style>

      <div style={styles.header}>
        <h1 style={styles.title}>Your Profile</h1>
        <p style={styles.subtitle}>Customize how InterviewIQ helps you prepare</p>
      </div>

      {/* ACCOUNT SETTINGS */}
      <div className="card section-card" style={styles.sectionCard}>
        <div style={styles.sectionHeader}>
            <User size={18} color="#2563eb" />
            <h3 style={styles.sectionTitle}>Account Details</h3>
        </div>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email Address</label>
          <div style={styles.emailBox}>
            <Mail size={16} /> {user.email}
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Full Name</label>
          <input className="profile-input" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" />
        </div>
      </div>

      {/* CAREER PREFERENCES */}
      <div className="card section-card" style={styles.sectionCard}>
        <div style={styles.sectionHeader}>
            <Briefcase size={18} color="#2563eb" />
            <h3 style={styles.sectionTitle}>Career Preferences</h3>
        </div>

        <div style={styles.grid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Primary Role</label>
            <select className="profile-input" value={role} onChange={e => setRole(e.target.value)}>
              <option value="">Select role</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Experience Level</label>
            <select className="profile-input" value={experience} onChange={e => setExperience(e.target.value)}>
              <option value="">Select level</option>
              {EXPERIENCE.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <label style={styles.label}>Preferred Learning Domains</label>
          <div style={styles.domainGrid}>
            {DOMAINS.map(d => (
              <div key={d} className={`domain-chip ${domains.includes(d) ? 'active' : ''}`} onClick={() => toggleDomain(d)}>
                {domains.includes(d) && <CheckCircle2 size={14} />}
                {d}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div style={styles.actions}>
        <button className="primary-btn" onClick={saveProfile} disabled={saving} style={styles.saveBtn}>
          <Save size={18} /> {saving ? 'Updating...' : 'Save Profile'}
        </button>
        
        <button onClick={logout} style={styles.logoutBtn}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '600px', margin: '0 auto', padding: '40px 20px' },
  header: { marginBottom: '32px' },
  title: { fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: 0 },
  subtitle: { fontSize: '15px', color: '#64748b', marginTop: '6px' },
  sectionCard: { padding: '24px', marginBottom: '24px' },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' },
  sectionTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 },
  label: { fontSize: '13px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.02em' },
  emailBox: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: '#f8fafc', borderRadius: '10px', marginTop: '6px', fontSize: '14px', color: '#475569', border: '1px solid #e2e8f0' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  domainGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' },
  inputGroup: { marginBottom: '16px' },
  actions: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '40px' },
  saveBtn: { width: '100%', padding: '14px', background: '#2563eb', color: '#fff', borderRadius: '12px', border: 'none', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  logoutBtn: { background: 'none', border: 'none', color: '#ef4444', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }
};