import { useEffect, useState } from 'react';
import { getExplorePosts, toggleLike } from '../api';
import CreatePost from '../components/CreatePost';
import Comments from '../components/Comments';

export default function Explore() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadPosts() {
        const res = await getExplorePosts();
        setPosts(res.data || []);
        setLoading(false);
    }

    async function handleLike(postId) {
        setPosts(posts =>
        posts.map(p =>
            p.id === postId
            ? {
                ...p,
                liked: !p.liked,
                likes: p.liked
                    ? Number(p.likes) - 1
                    : Number(p.likes) + 1
                }
            : p
        )
        );

        await toggleLike(postId);
    }

    useEffect(() => {
        loadPosts();
    }, []);

    if (loading) return <p>Loading explore feed...</p>;

    return (
        <div>
        <h1>Explore</h1>

        <CreatePost onPostCreated={loadPosts} />

        {posts.map(post => (
            <div
            key={post.id}
            style={{
                border: '1px solid #ddd',
                padding: '12px',
                marginBottom: '12px'
            }}
            >
            <strong>
                {post.is_admin ? 'InterviewIQ Admin' : post.user_name || 'Anonymous'}
            </strong>

            
            <pre
                style={{
                    whiteSpace: 'pre-wrap',   // ✅ wraps text
                    wordBreak: 'break-word',  // ✅ long words wrap
                    overflowWrap: 'anywhere'  // ✅ safety
                }}
                >
                {post.content}
            </pre>

            
            <button onClick={() => handleLike(post.id)}>
                {post.liked ? '❤️' : '🤍'} {post.likes}
            </button>
            
            <Comments postId={post.id} />

            <br />
            <small>{new Date(post.created_at).toLocaleString()}</small>
            </div>
        ))}
        </div>
    );
}