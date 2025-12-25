import { useEffect, useRef, useState } from 'react';
import { getExplorePostsPagenation, toggleLike } from '../api';
import CreatePost from '../components/CreatePost';
import Comments from '../components/Comments';
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
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  }

  function toggleComments(postId) {
    setOpenComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  }

  /* ---------------- FETCHING ---------------- */

  async function loadInitialPosts() {
    setLoading(true);
    const res = await getExplorePostsPagenation();
    console.log(res.data)
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

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    loadInitialPosts();
  }, []);

  // Overflow detection for Read More
  useEffect(() => {
    const overflowMap = {};

    posts.forEach(post => {
      const el = contentRefs.current[post.id];
      if (el) {
        overflowMap[post.id] = el.scrollHeight > el.clientHeight;
      }
    });

    setOverflowingPosts(overflowMap);
  }, [posts]);

  // Infinite scroll observer
  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMorePosts();
        }
      },
      { threshold: 1 }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [nextCursor, hasMore]);

  if (loading) return <p>Loading explore feed...</p>;

  return (
    <div className="explore-container">
      <h1>Explore</h1>

      <CreatePost onPostCreated={loadInitialPosts} />

      {posts.map(post => (
        <div key={post.id} className="post-card">
          {/* Header */}
          <div className="post-header">
            <span className="post-author">
              {post.is_admin ? 'InterviewIQ Admin' : post.user_name || 'Anonymous'}
            </span>
            {post.is_admin && <span className="admin-badge">Admin</span>}
          </div>

          {/* Content */}
          <pre
            ref={el => (contentRefs.current[post.id] = el)}
            className={`post-content
              ${overflowingPosts[post.id] && !expandedPosts[post.id] ? 'collapsed' : ''}
              ${expandedPosts[post.id] ? 'expanded' : ''}
            `}
          >
            {post.content}
          </pre>

          {/* Read more */}
          {overflowingPosts[post.id] && (
            <button
              className="read-more"
              onClick={() => toggleExpand(post.id)}
            >
              {expandedPosts[post.id] ? 'Show less' : 'Read more'}
            </button>
          )}

          {/* Actions */}
          <div className="post-actions">
            <button
              className="like-btn"
              onClick={() => handleLike(post.id)}
            >
              {post.liked ? '❤️' : '🤍'} {post.likes}
            </button>
          </div>

          {/* Comments */}
          <button
            className="comments-toggle"
            onClick={() => toggleComments(post.id)}
          >
            {openComments[post.id] ? 'Hide comments' : 'View comments'}
          </button>

          {openComments[post.id] && (
            <div className="comments-wrapper">
              <Comments postId={post.id} />
            </div>
          )}

          {/* Meta */}
          <div className="post-meta">
            {new Date(post.created_at).toLocaleString()}
          </div>
        </div>
      ))}

      {/* Infinite scroll sentinel */}
      {hasMore && (
        <div ref={sentinelRef} style={{ height: '40px' }} />
      )}

      {loadingMore && (
        <p style={{ textAlign: 'center', marginTop: '8px' }}>
          Loading more…
        </p>
      )}
    </div>
  );
}