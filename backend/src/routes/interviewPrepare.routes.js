const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
const { generatePrepQuestions } = require('../services/ai.prepare.service');

/**
 * GET existing preparation
 * GET /api/interviews/:id/prepare
 */
router.get('/:id/prepare', auth, async (req, res) => {
    const userId = req.user.id;
    const interviewId = req.params.id;

    const result = await pool.query(
        `
        SELECT *
        FROM interview_preparation ip
        JOIN interviews i ON ip.interview_id = i.id
        WHERE ip.interview_id = $1 AND i.user_id = $2
        `,
        [interviewId, userId]
    );

    if (result.rows.length === 0) {
        return res.json({ success: true, data: null });
    }

    res.json({ success: true, data: result.rows[0] });
    });

    /**
     * POST generate preparation questions
     * POST /api/interviews/:id/prepare
     */
router.post('/:id/prepare', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const interviewId = req.params.id;
    const { experience_level, location, job_description } = req.body;

    // 1️⃣ Verify interview + get company name
    const interviewRes = await pool.query(
      `
      SELECT i.id, i.role, c.name AS company_name
      FROM interviews i
      JOIN companies c ON c.id = i.company_id
      WHERE i.id = $1 AND i.user_id = $2
      `,
      [interviewId, userId]
    );

    if (interviewRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    const interview = interviewRes.rows[0];

    // 2️⃣ Call AI
    const questions = await generatePrepQuestions({
      company: interview.company_name,   // ✅ FIX
      role: interview.role,
      experience_level,
      location,
      job_description
    });

    // 3️⃣ Store (IMPORTANT FIX HERE)
    const saved = await pool.query(
      `
      INSERT INTO interview_preparation
        (interview_id, experience_level, location, job_description, ai_questions)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (interview_id)
      DO UPDATE SET
        experience_level = EXCLUDED.experience_level,
        location = EXCLUDED.location,
        job_description = EXCLUDED.job_description,
        ai_questions = EXCLUDED.ai_questions,
        updated_at = now()
      RETURNING *
      `,
      [
        interviewId,
        experience_level || null,
        location || null,
        job_description || null,
        JSON.stringify(questions)   // ✅ THIS IS THE CRITICAL FIX
      ]
    );

    res.json({
      success: true,
      data: saved.rows[0]
    });

  } catch (err) {
    console.error('Interview prepare error:', err);
    res.status(500).json({ success: false });
  }
});


module.exports = router;