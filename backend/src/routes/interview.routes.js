const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// POST /api/interviews
router.post('/', auth, async (req, res) => {
    try {
        
        const userId = req.user.id; // ✅ FROM JWT

        const {
  company_id,
  role,
  interview_date,
  interview_type, // 'upcoming' | 'past'
  result,
  description
} = req.body;

        console.log('req.user ',req.user, 'req.body ', req.body )

        // Validation
if (!interview_type || !['upcoming', 'past'].includes(interview_type)) {
  return res.status(400).json({
    success: false,
    message: 'interview_type must be upcoming or past'
  });
}

// Upcoming interview rules
if (interview_type === 'upcoming' && result) {
  return res.status(400).json({
    success: false,
    message: 'Upcoming interview cannot have result'
  });
}

// Past interview rules
if (interview_type === 'past' && !result) {
  return res.status(400).json({
    success: false,
    message: 'Past interview must have result'
  });
}

        const insertQuery = `
        INSERT INTO interviews (
        user_id,
        company_id,
        role,
        interview_date,
        interview_type,
        result,
        description
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING
            id,
            company_id,
            role,
            interview_date,
            interview_type,
            result,
            description
        `;
        const values = [
        userId,
        company_id,
        role.trim(),
        interview_date,
        interview_type,
        interview_type === 'upcoming' ? null : result,
        description || null
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
            i.interview_type,
            i.result,
            i.description,
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

// GET /api/interviews/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const interviewId = req.params.id;
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        i.id,
        i.role,
        i.interview_date,
        i.result,
        i.interview_type,
        c.name AS company_name
      FROM interviews i
      JOIN companies c ON c.id = i.company_id
      WHERE i.id = $1 AND i.user_id = $2
      `,
      [interviewId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// PATCH /api/interviews/:id/mark-past
router.patch('/:id/mark-past', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const interviewId = req.params.id;

    const result = await pool.query(
      `
      UPDATE interviews
      SET interview_type = 'past'
      WHERE id = $1
        AND user_id = $2
        AND interview_type = 'upcoming'
      RETURNING id, interview_type
      `,
      [interviewId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Interview already marked as past or not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
