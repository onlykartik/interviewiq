import { useEffect, useState } from 'react';
import { getPostComments, addPostComment } from '../api';

export default function Comments({ postId }) {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');

    async function load() {
        const res = await getPostComments(postId);
        setComments(res.data || []);
    }

    async function submit() {
        if (!text.trim()) return;
        await addPostComment(postId, text);
        setText('');
        load();
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <div style={{ marginTop: '8px' }}>
        {comments.map(c => (
            <div key={c.id} style={{ fontSize: '14px', marginBottom: '4px' }}>
            <strong>{c.user_name}</strong>: {c.comment}
            </div>
        ))}

        <input
            placeholder="Add a comment..."
            value={text}
            onChange={e => setText(e.target.value)}
            style={{ width: '100%' }}
        />

        <button onClick={submit}>Comment</button>
        </div>
    );
}