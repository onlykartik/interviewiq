export default function Card({ title, children }) {
    return (
        <div style={styles.card}>
        {title && <h3 style={styles.title}>{title}</h3>}
        {children}
        </div>
    );
    }

    const styles = {
    card: {
        background: '#fff',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        boxShadow: '0 1px 6px rgba(0,0,0,0.06)'
    },
    title: {
        marginBottom: '12px',
        fontSize: '16px'
    }
};