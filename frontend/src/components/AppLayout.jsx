import Navbar from './Navbar';

export default function AppLayout({ children }) {
    return (
        <div style={styles.app}>
        <Navbar />
        <main style={styles.main}>{children}</main>
        </div>
    );
    }

    const styles = {
    app: {
        minHeight: '100vh',
        background: '#f7f9fc'
    },
    main: {
        maxWidth: '960px',
        margin: '0 auto',
        padding: '16px'
    }
};