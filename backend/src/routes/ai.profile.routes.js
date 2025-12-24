const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
const { analyzeUserProfile } = require('../services/ai.profile.service');
const { shouldReanalyze } = require('../utils/aiRefresh.util');

router.post('/refresh', auth, async (req, res) => {
  const userId = req.user.id;

  const profileRes = await pool.query(
    `SELECT * FROM user_ai_profile WHERE user_id = $1`,
    [userId]
  );

  const newQuestions = await pool.query(
    `SELECT COUNT(*) FROM questions WHERE user_id = $1 AND analyzed = false`,
    [userId]
  );

  const profile = profileRes.rows[0];
  const newCount = Number(newQuestions.rows[0].count);

  if (!shouldReanalyze(profile, newCount)) {
    return res.json({ success: true, refreshed: false });
  }

  const aiData = await analyzeUserProfile(userId);

  res.json({
    success: true,
    refreshed: true,
    data: aiData
  });
});

module.exports = router;