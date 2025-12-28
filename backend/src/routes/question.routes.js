const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// POST /api/questions
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      interview_id,
      question_text,
      topic,
      difficulty,
      round,
      user_answer
    } = req.body;

    // 🔒 Basic validation
    if (!interview_id || !question_text) {
      return res.status(400).json({
        success: false,
        message: 'interview_id and question_text are required'
      });
    }

    // 🔍 Check interview ownership + type
    const interviewRes = await pool.query(
      `
      SELECT interview_type
      FROM interviews
      WHERE id = $1 AND user_id = $2
      `,
      [interview_id, userId]
    );

    if (interviewRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    // 🚫 Block adding questions for upcoming interviews
    if (interviewRes.rows[0].interview_type === 'upcoming') {
      return res.status(400).json({
        success: false,
        message: 'You can add questions only for past interviews'
      });
    }

    // ✅ Insert question
    const insertQuery = `
      INSERT INTO questions
        (interview_id, user_id, question_text, topic, difficulty, round, user_answer)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
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

    const result = await pool.query(insertQuery, values);

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error adding question:', error.message);

    // Foreign key violation
    if (error.code === '23503') {
      return res.status(400).json({
        success: false,
        message: 'Invalid interview_id'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;