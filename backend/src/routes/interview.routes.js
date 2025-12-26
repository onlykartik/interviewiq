const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// POST /api/interviews
router.post('/', auth, async (req, res) => {
    try {
        
        const userId = req.user.id; // ✅ FROM JWT

        const { company_id, role, interview_date, result } = req.body;
        console.log('req.user ',req.user, 'req.body ', req.body )
        // Validation
        if (!company_id || !role || !interview_date) {
        return res.status(400).json({
            success: false,
            message: 'company_id, role and interview_date are required'
        });
        }
        const insertQuery = `
        INSERT INTO interviews (user_id, company_id, role, interview_date, result)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, company_id, role, interview_date, result
        `;
        const values = [
        userId,
        company_id,
        role.trim(),
        interview_date,
        result || 'Pending'
        ];

        const resultDb = await pool.query(insertQuery, values);

        res.status(201).json({
        success: true,
        data: resultDb.rows[0]
        });

    } catch (error) {
        console.error('Error creating interview:', error.message);

        // Foreign key violation (company doesn't exist)
        if (error.code === '23503') {
        return res.status(400).json({
            success: false,
            message: 'Invalid company_id'
        });
        }

        res.status(500).json({ success: false });
    }
});


// GET /api/interviews
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const query = `
        SELECT
            i.id,
            i.role,
            i.interview_date,
            i.result,
            c.id AS company_id,
            c.name AS company_name
        FROM interviews i
        JOIN companies c
            ON i.company_id = c.id
        WHERE i.user_id = $1
        ORDER BY i.interview_date DESC
        `;

        const result = await pool.query(query, [userId]);

        res.json({
        success: true,
        data: result.rows
        });

    } catch (error) {
        console.error('Error fetching interviews:', error.message);
        res.status(500).json({ success: false });
    }
});

// GET /api/interviews/:id/questions
router.get('/:id/questions',auth, async (req, res) => {
    try {
        const interviewId = req.params.id;
        const userId = req.user.id;

        console.log('details --> ',interviewId, userId)

        // Basic validation
        if (!interviewId) {
        return res.status(400).json({
            success: false,
            message: 'Interview id is required'
        });
        }

        const query = `
        SELECT
            q.id,
            q.question_text,
            q.topic,
            q.difficulty,
            q.round,
            q.user_answer,
            q.created_at
        FROM questions q
        WHERE q.interview_id = $1
            AND q.user_id = $2
        ORDER BY q.created_at ASC
        `;

        const result = await pool.query(query, [interviewId,userId]);

        res.json({
        success: true,
        data: result.rows
        });

    } catch (error) {
        console.error('Error fetching questions:', error.message);
        res.status(500).json({ success: false });
    }
});




module.exports = router;
