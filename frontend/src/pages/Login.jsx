import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleLogin from '../components/GoogleLogin';
import { signup } from '../api';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [mode, setMode] = useState('login'); // 'login' | 'signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');

    // LOGIN
    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);

        try {
        const res = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        console.log('LOGIN RESPONSE:', data);

        const token =
        data.token ||
        data.data?.token ||
        data.accessToken;
        if (!res.ok || !token) {
        alert(data.message || 'Login failed');
            return;
        }
        login(token); 
        navigate('/'); // ✅ THIS WAS MISSING

        } catch(err) {
                console.error(err);
                alert('Login error');
        } finally {
        setLoading(false);
        }
    }

    // SIGN UP
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
        navigate('/');
        } catch {
        alert('Signup error');
        } finally {
        setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: '400px' }}>
        <h2>{mode === 'login' ? 'Login' : 'Create Account'}</h2>

        <form onSubmit={mode === 'login' ? handleLogin : handleSignup}>
            {mode === 'signup' && (
            <input
                placeholder="Your Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
            />
            )}

            <input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            />

            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            />

            {mode === 'signup' && (
            <input
                type="password"
                placeholder="Re-enter Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
            />
            )}

            <button type="submit" disabled={loading}>
            {loading
                ? 'Please wait...'
                : mode === 'login'
                ? 'Login'
                : 'Sign up'}
            </button>
        </form>

        {/* MODE SWITCH */}
        {mode === 'login' ? (
            <p style={{ marginTop: '10px' }}>
            New user?{' '}
            <button onClick={() => {
                setMode('signup');
                setName('');
                }}>
                Create account
            </button>
            </p>
        ) : (
            <p style={{ marginTop: '10px' }}>
            Already have an account?{' '}
            <button onClick={() => {
                setMode('login');
                setName('');
                }}>
                Back to Login
            </button>
            </p>
        )}

        {mode === 'login' && (
            <>
            <hr />
            <GoogleLogin /> 
            </>
        )}
        </div>
    );
}