import { useEffect, useState } from 'react';
import { getPostComments, addPostComment } from '../api';
import { Send, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function Comments({ postId }) {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function load() {
        const res = await getPostComments(postId);
        setComments(res.data || []);
    }

    async function submit() {
        if (!text.trim()) return;
        setIsSubmitting(true);
        try {
            await addPostComment(postId, text);
            setText('');
            load();
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        load();
    }, [postId]);

    return (
        <div className="comments-thread" style={styles.thread}>
            <style>{`
                .comment-input:focus { border-color: #2563eb !important; outline: none; }
                .comment-item { animation: fadeIn 0.3s ease; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
                .comment-body p { margin: 0; }
            `}</style>

            {/* List of Comments */}
            <div style={styles.list}>
                {comments.length === 0 ? (
                    <p style={styles.noComments}>Be the first to share your thoughts!</p>
                ) : (
                    comments.map(c => (
                        <div key={c.id} className="comment-item" style={styles.commentItem}>
                            <div style={styles.avatar}>
                                <User size={12} color="#94a3b8" />
                            </div>
                            <div style={styles.commentContent}>
                                <div style={styles.userName}>{c.user_name || 'Anonymous'}</div>
                                <div style={styles.commentBody}>
                                    <ReactMarkdown>{c.comment}</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input Area */}
            <div style={styles.inputWrapper}>
                <input
                    placeholder="Write a helpful reply..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                    className="comment-input"
                    style={styles.input}
                    onKeyDown={(e) => e.key === 'Enter' && submit()}
                />
                <button 
                    onClick={submit} 
                    disabled={isSubmitting || !text.trim()}
                    style={styles.sendBtn}
                >
                    <Send size={16} />
                </button>
            </div>
        </div>
    );
}

const styles = {
    thread: {
        marginTop: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    commentItem: {
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-start'
    },
    avatar: {
        width: '28px',
        height: '28px',
        background: '#fff',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #e2e8f0',
        flexShrink: 0
    },
    commentContent: {
        background: '#fff',
        padding: '8px 12px',
        borderRadius: '12px',
        border: '1px solid #f1f5f9',
        fontSize: '14px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
        flex: 1
    },
    userName: {
        fontWeight: '700',
        fontSize: '12px',
        color: '#1e293b',
        marginBottom: '2px'
    },
    commentBody: {
        color: '#475569',
        lineHeight: '1.4'
    },
    noComments: {
        fontSize: '13px',
        color: '#94a3b8',
        textAlign: 'center',
        margin: '10px 0'
    },
    inputWrapper: {
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        background: '#fff',
        padding: '4px',
        borderRadius: '10px',
        border: '1px solid #e2e8f0'
    },
    input: {
        flex: 1,
        border: 'none',
        padding: '8px 12px',
        fontSize: '14px',
        background: 'transparent'
    },
    sendBtn: {
        background: '#2563eb',
        color: '#fff',
        border: 'none',
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: '0.2s'
    }
};