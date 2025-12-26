import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Briefcase, BookOpen, Globe, User } from 'lucide-react';

export default function Navbar() {
    const { logout } = useAuth();

    const navLinkStyle = ({ isActive }) => ({
    ...styles.link,
    color: isActive ? '#2563eb' : '#64748b',
    backgroundColor: isActive ? '#eff6ff' : 'transparent',
    fontWeight: isActive ? '600' : '500',
    });

    return (
        <nav className="navbar" style={styles.nav}>
        <style>{`
            .navbar {
            position: sticky;
            top: 0;
            z-index: 1000;
            background: white;
            border-bottom: 1px solid #f1f5f9;
            }

            /* PC Layout */
            .nav-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            maxWidth: 1200px;
            margin: 0 auto;
            padding: 12px 24px;
            }

            /* Mobile Layout Adjustments */
            @media (max-width: 768px) {
            .nav-container {
                padding: 12px 16px;
            }
            
            /* Move Nav to Bottom on Mobile */
            .nav-links {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: white;
                display: grid !important;
                grid-template-columns: repeat(5, 1fr); /* 5 Equal columns */
                border-top: 1px solid #e5e7eb;
                padding: 8px 0 !important;
                gap: 0 !important;
                height: 65px;
            }

            .nav-link {
                flex-direction: column !important; /* Stack Icon over Text */
                gap: 4px !important;
                padding: 4px !important;
                border-radius: 0 !important;
                background-color: transparent !important;
                font-size: 10px !important; /* Smaller text for mobile */
                text-align: center;
            }

            .nav-link svg {
                width: 20px;
                height: 20px;
            }

            .logout-btn {
                padding: 6px 10px !important;
                font-size: 12px !important;
            }
            
            .main-content-padding {
                padding-bottom: 70px; /* Prevents content from being hidden behind the bottom bar */
            }
            }
        `}</style>

        <div className="nav-container">
            {/* Logo Section */}
            <div style={styles.logo}>
            <div style={styles.logoIcon}>IQ</div>
            <span style={styles.logoText}>Interview<span style={{ color: '#2563eb' }}>IQ</span></span>
            </div>

            {/* Navigation Links */}
            <div className="nav-links" style={styles.links}>
            <NavLink to="/" style={navLinkStyle} className="nav-link">
                <LayoutDashboard size={18} />
                <span className="nav-link-text">Home</span>
            </NavLink>
            <NavLink to="/interviews" style={navLinkStyle} className="nav-link">
                <Briefcase size={18} />
                <span className="nav-link-text">Interviews</span>
            </NavLink>
            <NavLink to="/prepare" style={navLinkStyle} className="nav-link">
                <BookOpen size={18} />
                <span className="nav-link-text">Prepare</span>
            </NavLink>
            <NavLink to="/explore" style={navLinkStyle} className="nav-link">
                <Globe size={18} />
                <span className="nav-link-text">Explore</span>
            </NavLink>
            <NavLink to="/profile" style={navLinkStyle} className="nav-link">
                <User size={18} />
                <span className="nav-link-text">Profile</span>
            </NavLink>
            </div>

            {/* Logout Button */}
            <button onClick={logout} style={styles.logout} className="logout-btn">
            <LogOut size={16} />
            <span>Logout</span>
            </button>
        </div>
        </nav>
    );
    }

    const styles = {
    nav: {
        width: '100%',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    logoIcon: {
        background: '#2563eb',
        color: 'white',
        padding: '4px 6px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 'bold'
    },
    logoText: {
        fontWeight: '800',
        fontSize: '18px',
        color: '#1e293b',
        letterSpacing: '-0.5px',
    },
    links: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    link: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        textDecoration: 'none',
        fontSize: '14px',
        padding: '8px 14px',
        borderRadius: '8px',
        transition: 'all 0.2s ease',
    },
    logout: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: '#fff',
        border: '1px solid #e2e8f0',
        padding: '8px 14px',
        borderRadius: '8px',
        color: '#ef4444', // Red color for logout
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
};