import { useState } from 'react';
import { createExplorePost } from '../api';
import { Bold, Italic, List, Send, Quote } from 'lucide-react';

export default function CreatePost({ onPostCreated }) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    // Helper to wrap selected text or insert symbols
    const insertStyle = (symbol, suffix = symbol) => {
        const textarea = document.getElementById('post-textarea');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const before = text.substring(0, start);
        const after = text.substring(end, text.length);
        const selected = text.substring(start, end);

        setContent(`${before}${symbol}${selected}${suffix}${after}`);
        textarea.focus();
    };

    async function handlePost() {
        if (!content.trim()) return;
        setLoading(true);
        const res = await createExplorePost({ content });
        setLoading(false);

        if (res.success) {
            setContent('');
            onPostCreated();
        } else {
            alert(res.message || 'Failed to post');
        }
    }

    return (
        <div style={styles.card}>
            <style>{`
                .toolbar-btn {
                    background: none; border: none; padding: 8px; 
                    cursor: pointer; color: #64748b; border-radius: 6px;
                    transition: 0.2s;
                }
                .toolbar-btn:hover { background: #eff6ff; color: #2563eb; }
                .post-textarea:focus { outline: none; border-color: #2563eb; }
                @media (max-width: 600px) {
                    .create-post-container { margin-bottom: 24px; }
                }
            `}</style>

            <div style={styles.toolbar}>
                <button className="toolbar-btn" title="Bold" onClick={() => insertStyle('**')}>
                    <Bold size={18} />
                </button>
                <button className="toolbar-btn" title="Italic" onClick={() => insertStyle('*')}>
                    <Italic size={18} />
                </button>
                <button className="toolbar-btn" title="Quote" onClick={() => insertStyle('> ')}>
                    <Quote size={18} />
                </button>
                <button className="toolbar-btn" title="Bullet List" onClick={() => insertStyle('- ')}>
                    <List size={18} />
                </button>
            </div>

            <textarea
                id="post-textarea"
                className="post-textarea"
                placeholder="Share your interview tips (use **bold** for emphasis)..."
                rows={4}
                style={styles.textarea}
                value={content}
                onChange={e => setContent(e.target.value)}
            />

            <div style={styles.footer}>
                <span style={styles.hint}>Markdown supported</span>
                <button 
                    onClick={handlePost} 
                    disabled={loading || !content.trim()} 
                    style={{...styles.postBtn, opacity: loading || !content.trim() ? 0.6 : 1}}
                >
                    {loading ? 'Posting...' : <><Send size={16} /> Post</>}
                </button>
            </div>
        </div>
    );
}

const styles = {
    card: {
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '12px',
        marginBottom: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
    },
    toolbar: {
        display: 'flex',
        gap: '4px',
        borderBottom: '1px solid #f1f5f9',
        paddingBottom: '8px',
        marginBottom: '8px'
    },
    textarea: {
        width: '100%',
        border: '1px solid transparent',
        padding: '8px',
        fontSize: '15px',
        fontFamily: 'inherit',
        resize: 'vertical',
        boxSizing: 'border-box',
        minHeight: '100px'
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '8px',
        paddingTop: '8px',
        borderTop: '1px solid #f1f5f9'
    },
    postBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: '#2563eb',
        color: 'white',
        border: 'none',
        padding: '8px 20px',
        borderRadius: '8px',
        fontWeight: '700',
        cursor: 'pointer'
    },
    hint: { fontSize: '11px', color: '#94a3b8', fontWeight: '500' }
};