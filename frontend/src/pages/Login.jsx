import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleLogin from '../components/GoogleLogin';
import { signup,loginUser } from '../api';

import { Mail, Lock, User, ArrowRight, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [mode, setMode] = useState('login'); 
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    
    async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
        const data = await loginUser(email, password);
        const token =
        data.token ||
        data.data?.token ||
        data.accessToken;

        if (!token) {
        alert('Login failed');
        return;
        }

        login(token);
        navigate('/');
    } catch (err) {
        alert(err.message || 'Login error');
    } finally {
        setLoading(false);
    }
    }

    async function handleSignup(e) {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const data = await signup(name, email, password);
            if (!data.success) {
                alert(data.message || 'Signup failed');
                return;
            }
            login(data.token);
            console.log('On sign in ', data)
            navigate('/');
        } catch {
            alert('Signup error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={styles.page}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
                
                .auth-card { animation: fadeIn 0.5s ease-out; }
                .input-group { position: relative; width: 100%; }
                .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; z-index: 10; }
                .auth-input { width: 100%; padding: 14px 14px 14px 44px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-size: 16px; transition: all 0.2s; box-sizing: border-box; background: #fff; }
                .auth-input:focus { border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); outline: none; }
                
                .primary-btn { width: 100%; padding: 14px; border-radius: 12px; border: none; background: #2563eb; color: white; font-weight: 700; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 16px; }
                .primary-btn:active { transform: scale(0.98); }
                
                .mobile-branding { display: none; }

                @media (max-width: 900px) { 
                    .hero-side { display: none !important; } 
                    .mobile-branding { 
                        display: block; 
                        padding: 0 10px;
                        margin-bottom: 40px;
                        text-align: center;
                    }
                    .auth-card { 
                        width: 100% !important; 
                        max-width: 400px !important; 
                        box-shadow: none !important;
                        padding: 0 !important;
                        background: transparent !important;
                    }
                    .form-side { 
                        background: #fff !important; 
                        align-items: flex-start !important; 
                        padding-top: 50px !important;
                    }
                }
            `}</style>

            {/* Left Side: PC Hero (Visible only on Desktop) */}
            <div className="hero-side" style={styles.heroSide}>
                <div style={{ maxWidth: '440px' }}>
                    <div style={styles.logoBadge}><Sparkles size={16} /> InterviewIQ</div>
                    <h1 style={styles.heroTitle}>Master your next interview with clarity.</h1>
                    <p style={styles.heroText}>Prepare once. Perform better every time. InterviewIQ helps you learn from every interview.</p>
                    <div style={styles.featureList}>
                        <div style={styles.featureItem}><CheckCircle2 size={18} color="#38bdf8" /> Practice what you were actually asked.</div>
                        <div style={styles.featureItem}><CheckCircle2 size={18} color="#38bdf8" /> Build confidence from your own experiences.</div>    
                        <div style={styles.featureItem}><CheckCircle2 size={18} color="#38bdf8" /> Community Experience Feed</div>
                        <div style={styles.featureItem}><CheckCircle2 size={18} color="#38bdf8" /> Daily Skill Quizzes</div>
                    </div>
                </div>
            </div>

            {/* Right Side: Auth Form */}
            <div className="form-side" style={styles.formSide}>
                <div className="auth-card" style={styles.card}>
                    
                    {/* MOBILE BRANDING SECTION (Added this back for you!) */}
                    <div className="mobile-branding">
                        <div style={styles.mobileBadge}>
                            <Sparkles size={14} /> InterviewIQ
                        </div>
                        <h2 style={styles.mobileTitle}>Master your interviews with clarity.</h2>
                        <p style={styles.mobileSubtitle}>Prepare once. Perform better every time.</p>
                        
                        <div style={styles.mobileFeatureRow}>
                            <div style={styles.miniTag}><ShieldCheck size={12} /> Real Questions</div>
                            <div style={styles.miniTag}><Sparkles size={12} /> Daily Quizzes</div>
                        </div>
                    </div>

                    <h2 className="pc-only-title" style={styles.pcTitle}>
                        {mode === 'login' ? 'Welcome Back' : 'Get Started'}
                    </h2>
                    <p className="pc-only-subtitle" style={styles.pcSubtitle}>
                        {mode === 'login'
                            ? 'Continue your journey to a new career'
                            : 'Join 1,000+ developers preparing today'}
                    </p>

                    <form onSubmit={mode === 'login' ? handleLogin : handleSignup} style={styles.form}>
                        {mode === 'signup' && (
                            <div className="input-group">
                                <User className="input-icon" size={18} />
                                <input
                                    className="auth-input"
                                    placeholder="Your full name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        <div className="input-group">
                            <Mail className="input-icon" size={18} />
                            <input
                                className="auth-input"
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <Lock className="input-icon" size={18} />
                            <input
                                className="auth-input"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {mode === 'signup' && (
                            <div className="input-group">
                                <Lock className="input-icon" size={18} />
                                <input
                                    className="auth-input"
                                    type="password"
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        <button className="primary-btn" disabled={loading}>
                            {loading ? 'Processing...' : (
                                <>
                                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div style={styles.switch}>
                        <span>{mode === 'login' ? "Don't have an account?" : "Already a member?"}</span>
                        <button
                            style={styles.linkBtn}
                            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setName(''); }}
                        >
                            {mode === 'login' ? 'Create one now' : 'Sign in here'}
                        </button>
                    </div>

                    {mode === 'login' && (
                        <div style={styles.googleSection}>
                            <div style={styles.divider}>
                                <span style={styles.line}></span>
                                <span style={styles.dividerText}>OR</span>
                                <span style={styles.line}></span>
                            </div>
                            <GoogleLogin />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: { minHeight: '100vh', display: 'flex', background: '#fff' },
    heroSide: { flex: 1, background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: '40px' },
    formSide: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#f8fafc' },
    logoBadge: { display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', color: '#38bdf8', marginBottom: '24px', fontWeight: '600' },
    heroTitle: { fontSize: '42px', fontWeight: '800', lineHeight: '1.1', marginBottom: '20px' },
    heroText: { fontSize: '18px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '32px' },
    featureList: { display: 'flex', flexDirection: 'column', gap: '16px' },
    featureItem: { fontSize: '15px', fontWeight: '500', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '10px' },
    card: { width: '100%', maxWidth: '400px', padding: '20px' },
    pcTitle: { fontSize: '28px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' },
    pcSubtitle: { fontSize: '15px', color: '#64748b', marginBottom: '32px' },
    
    // Mobile branding styles
    mobileBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eff6ff', color: '#2563eb', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '16px' },
    mobileTitle: { fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '8px', lineHeight: '1.2' },
    mobileSubtitle: { fontSize: '14px', color: '#64748b', marginBottom: '20px' },
    mobileFeatureRow: { display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '8px' },
    miniTag: { fontSize: '11px', fontWeight: '600', color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' },

    form: { display: 'flex', flexDirection: 'column', gap: '18px' },
    switch: { marginTop: '28px', textAlign: 'center', fontSize: '15px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '6px' },
    linkBtn: { background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: '700', padding: 0, fontSize: '15px' },
    googleSection: { marginTop: '32px' },
    divider: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' },
    line: { flex: 1, height: '1px', background: '#e2e8f0' },
    dividerText: { fontSize: '12px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.05em' }
};