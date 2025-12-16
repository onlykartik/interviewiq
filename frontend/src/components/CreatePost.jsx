import { useState } from 'react';
import { createExplorePost } from '../api';

export default function CreatePost({ onPostCreated }) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

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
        <div style={{ marginBottom: '16px' }}>
        <textarea
            placeholder="Share your interview experience, tips, or thoughts…"
            rows={3}
            style={{ width: '100%' }}
            value={content}
            onChange={e => setContent(e.target.value)}
        />

        <button onClick={handlePost} disabled={loading}>
            {loading ? 'Posting...' : 'Post'}
        </button>
        </div>
    );
}