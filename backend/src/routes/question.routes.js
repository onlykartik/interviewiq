const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// POST /api/questions
router.post('/',auth, async (req, res) => {
        
    try {
        
        const userId = req.user.id;   // ✅ FROM JWT

        const {
        interview_id,
        question_text,
        topic,
        difficulty,
        round,
        user_answer
        } = req.body;

        // Validation
        if (!interview_id || !question_text) {
        return res.status(400).json({
            success: false,
            message: 'interview_id and question_text are required'
        });
        }

        const query = `
        INSERT INTO questions
        (interview_id, user_id, question_text, topic, difficulty, round, user_answer)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `;

        const values = [
        interview_id,
        userId,
        question_text.trim(),
        topic || null,
        difficulty || null,
        round || null,
        user_answer || null
        ];

        const result = await pool.query(query, values);

        res.status(201).json({
        success: true,
        data: result.rows[0]
        });

    } catch (error) {
        console.error('Error adding question:', error.message);

        // interview_id does not exist
        if (error.code === '23503') {
        return res.status(400).json({
            success: false,
            message: 'Invalid interview_id'
        });
        }

        res.status(500).json({ success: false });
    }
});

module.exports = router;
