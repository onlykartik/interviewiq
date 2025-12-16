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

module.exports = router;