import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { logout } = useAuth();

    return (
        <nav style={styles.nav}>
        <div style={styles.logo}>InterviewIQ</div>

        <div style={styles.links}>
            <NavLink to="/" style={styles.link}>Home</NavLink>
            <NavLink to="/interviews" style={styles.link}>Interviews</NavLink>
            <NavLink to="/prepare" style={styles.link}>Prepare</NavLink>
            <NavLink to="/explore" style={styles.link}>Explore</NavLink>
            <NavLink to="/profile" style={styles.link}>Profile</NavLink>

            {/* 🔴 Logout */}
            <button onClick={logout} style={styles.logout}>
            Logout
            </button>
        </div>
        </nav>
    );
    }

    const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid #ddd',
        flexWrap: 'wrap'
    },
    logo: {
        fontWeight: 'bold',
        fontSize: '18px'
    },
    links: {
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        alignItems: 'center'
    },
    link: {
        textDecoration: 'none',
        color: '#333'
    },
    logout: {
        background: 'none',
        border: '1px solid #ccc',
        padding: '4px 8px',
        cursor: 'pointer'
    }
};