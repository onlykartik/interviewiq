import { useEffect, useRef, useState } from 'react';
import { getExplorePostsPagenation, toggleLike } from '../api';
import CreatePost from '../components/CreatePost';
import Comments from '../components/Comments';
import { Heart, MessageCircle, Clock, ShieldCheck, User as UserIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './Explore.css';

export default function Explore() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const [expandedPosts, setExpandedPosts] = useState({});
    const [openComments, setOpenComments] = useState({});
    const [overflowingPosts, setOverflowingPosts] = useState({});

    const [nextCursor, setNextCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const contentRefs = useRef({});
    const sentinelRef = useRef(null);

    function toggleExpand(postId) {
        setExpandedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
    }

    function toggleComments(postId) {
        setOpenComments(prev => ({ ...prev, [postId]: !prev[postId] }));
    }

    async function loadInitialPosts() {
        setLoading(true);
        const res = await getExplorePostsPagenation();
        setPosts(res.data || []);
        setNextCursor(res.nextCursor);
        setHasMore(Boolean(res.nextCursor));
        setLoading(false);
    }

    async function loadMorePosts() {
        if (!hasMore || loadingMore) return;
        setLoadingMore(true);
        const res = await getExplorePostsPagenation(nextCursor);
        setPosts(prev => [...prev, ...(res.data || [])]);
        setNextCursor(res.nextCursor);
        setHasMore(Boolean(res.nextCursor));
        setLoadingMore(false);
    }

    async function handleLike(postId) {
        setPosts(posts =>
        posts.map(p =>
            p.id === postId
            ? { ...p, liked: !p.liked, likes: p.liked ? Number(p.likes) - 1 : Number(p.likes) + 1 }
            : p
        )
        );
        await toggleLike(postId);
    }

    useEffect(() => { loadInitialPosts(); }, []);

    useEffect(() => {
        const overflowMap = {};
        posts.forEach(post => {
        const el = contentRefs.current[post.id];
        if (el) overflowMap[post.id] = el.scrollHeight > el.clientHeight;
        });
        setOverflowingPosts(overflowMap);
    }, [posts]);

    useEffect(() => {
        if (!sentinelRef.current) return;
        const observer = new IntersectionObserver(
        entries => { if (entries[0].isIntersecting) loadMorePosts(); },
        { threshold: 1 }
        );
        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [nextCursor, hasMore]);

    if (loading) return <div className="loading-state">Loading explore feed...</div>;

    return (
        <div className="explore-container">
        <header className="explore-header">
            <h1 className="explore-title">Community Feed</h1>
            <p className="explore-subtitle">Learn from others' interview experiences</p>
        </header>

        <CreatePost onPostCreated={loadInitialPosts} />

        <div className="posts-list">
            {posts.map(post => (
            <div key={post.id} className="post-card">
                {/* Header */}
                <div className="post-header">
                <div className="author-info">
                    <div className={`avatar ${post.is_admin ? 'admin-avatar' : ''}`}>
                    {post.is_admin ? <ShieldCheck size={18} /> : <UserIcon size={18} />}
                    </div>
                    <div className="author-details">
                    <span className="post-author">
                        {post.is_admin ? 'InterviewIQ Admin' : post.user_name || 'Anonymous'}
                    </span>
                    <span className="post-time">
                        <Clock size={12} /> {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    </div>
                </div>
                {post.is_admin && <span className="admin-badge">Staff</span>}
                </div>

                {/* Content */}
                <div 
                ref={el => (contentRefs.current[post.id] = el)} // 👈 Add this back!
                className={`post-content ${overflowingPosts[post.id] && !expandedPosts[post.id] ? 'collapsed' : ''} ${expandedPosts[post.id] ? 'expanded' : ''}`}
                >
                <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>

                {/* Read more */}
                {overflowingPosts[post.id] && (
                <button className="read-more-btn" onClick={() => toggleExpand(post.id)}>
                    {expandedPosts[post.id] ? 'Show less' : 'Read more'}
                </button>
                )}

                {/* Actions */}
                <div className="post-actions">
                <button 
                    className={`action-btn like-btn ${post.liked ? 'liked' : ''}`}
                    onClick={() => handleLike(post.id)}
                >
                    <Heart size={18} fill={post.liked ? "#ef4444" : "none"} />
                    <span>{post.likes}</span>
                </button>
                
                <button 
                    className="action-btn comment-btn"
                    onClick={() => toggleComments(post.id)}
                >
                    <MessageCircle size={18} />
                    <span>Discussion</span>
                </button>
                </div>

                {/* Comments Section */}
                {openComments[post.id] && (
                <div className="comments-section">
                    <Comments postId={post.id} />
                </div>
                )}
            </div>
            ))}
        </div>

        {hasMore && <div ref={sentinelRef} className="sentinel" />}
        {loadingMore && <div className="loading-more">Loading more posts...</div>}
        </div>
    );
}