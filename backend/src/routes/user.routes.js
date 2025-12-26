const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET current user
router.get('/me', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
        'SELECT id, name, email FROM users WHERE id = $1',
        [userId]
        );

        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

// UPDATE name
router.put('/me', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { name } = req.body;

        if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Name required' });
        }

        await pool.query(
        'UPDATE users SET name=$1 WHERE id=$2',
        [name.trim(), userId]
        );

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

// GET profile
router.get('/profile', auth, async (req, res) => {
    const result = await pool.query(
        `SELECT * FROM user_profile WHERE user_id = $1`,
        [req.user.id]
    );

    res.json({
        success: true,
        data: result.rows[0] || null
    });
    });

    // CREATE / UPDATE profile
router.post('/profile', auth, async (req, res) => {
    const { primary_role, experience_level, preferred_domains, target_companies } = req.body;

    await pool.query(
        `
        INSERT INTO user_profile
        (user_id, primary_role, experience_level, preferred_domains, target_companies)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (user_id)
        DO UPDATE SET
        primary_role = EXCLUDED.primary_role,
        experience_level = EXCLUDED.experience_level,
        preferred_domains = EXCLUDED.preferred_domains,
        target_companies = EXCLUDED.target_companies,
        updated_at = now()
        `,
        [
        req.user.id,
        primary_role,
        experience_level,
        preferred_domains,
        target_companies
        ]
    );

    res.json({ success: true });
});

module.exports = router;