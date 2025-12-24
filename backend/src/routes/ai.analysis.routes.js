const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
const { askAI } = require('../services/ai.service');
const buildPrompt = require('../services/prompts/questionAnalysis.prompt');

router.post('/analyze', auth, async (req, res) => {
    const userId = req.user.id;

    const result = await pool.query(
        'SELECT question_text FROM questions WHERE user_id = $1',
        [userId]
    );

    if (result.rows.length === 0) {
        return res.json({ success: true, data: null });
    }

    const prompt = buildPrompt(result.rows);
    const aiResponse = await askAI(prompt);

    res.json({
        success: true,
        data: JSON.parse(aiResponse),
    });
});

module.exports = router;