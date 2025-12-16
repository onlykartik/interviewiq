const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/explore/posts
router.get('/posts', auth , async (req, res) => {
    try {
            const userId = req.user.id;
            console.log('userId from /posts', userId)
        const query = `
            SELECT
                p.id,
                p.content,
                p.media_url,
                p.media_type,
                p.is_admin,
                p.created_at,
                u.name AS user_name,

                COUNT(pl.id) AS likes,

                EXISTS (
                SELECT 1
                FROM post_likes pl2
                WHERE pl2.post_id = p.id
                AND pl2.user_id = $1
                ) AS liked

            FROM posts p
            LEFT JOIN users u ON p.user_id = u.id
            LEFT JOIN post_likes pl ON pl.post_id = p.id

            GROUP BY p.id, u.name
            ORDER BY p.created_at DESC
                    `;

        const result = await pool.query(query, [userId]);

        res.json({
        success: true,
        data: result.rows
        });

    } catch (err) {
        console.error('Explore fetch error:', err.message);
        res.status(500).json({ success: false });
    }
});

// POST /api/explore/posts
router.post('/posts', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { content, media_url, media_type } = req.body;

        if (!content || content.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Post content is required'
        });
        }

        const query = `
        INSERT INTO posts (user_id, content, media_url, media_type, is_admin)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `;

        const values = [
        userId,
        content.trim(),
        media_url || null,
        media_type || null,
        req.user.role === 'admin'
        ];

        const result = await pool.query(query, values);

        res.status(201).json({
        success: true,
        data: result.rows[0]
        });

    } catch (err) {
        console.error('Create post error:', err.message);
        res.status(500).json({ success: false });
    }
});

router.post('/:id/like', auth, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    try {
        const check = await pool.query(
        `SELECT id FROM post_likes WHERE post_id=$1 AND user_id=$2`,
        [postId, userId]
        );

        if (check.rows.length > 0) {
        // Unlike
        await pool.query(
            `DELETE FROM post_likes WHERE post_id=$1 AND user_id=$2`,
            [postId, userId]
        );
        return res.json({ liked: false });
        }

        // Like
        await pool.query(
        `INSERT INTO post_likes (post_id, user_id) VALUES ($1,$2)`,
        [postId, userId]
        );

        res.json({ liked: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

// GET /api/explore/posts/:id/comments
router.get('/posts/:id/comments', async (req, res) => {
    try {
        const postId = req.params.id;

        const query = `
        SELECT
            c.id,
            c.comment,
            c.created_at,
            u.name AS user_name
        FROM post_comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.post_id = $1
        ORDER BY c.created_at ASC
        `;

        const result = await pool.query(query, [postId]);

        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error('Fetch comments error:', err.message);
        res.status(500).json({ success: false });
    }
});

// POST /api/explore/posts/:id/comments
router.post('/posts/:id/comments', auth, async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        const { comment } = req.body;

        if (!comment || !comment.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Comment cannot be empty'
        });
        }

        const query = `
        INSERT INTO post_comments (post_id, user_id, comment)
        VALUES ($1, $2, $3)
        RETURNING *
        `;

        const result = await pool.query(query, [
        postId,
        userId,
        comment.trim()
        ]);

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error('Create comment error:', err.message);
        res.status(500).json({ success: false });
    }
});
module.exports = router;