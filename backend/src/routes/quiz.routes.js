const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateTodayQuiz } = require('../services/quiz.service');

router.get('/today', auth, async (req, res) => {
    const quiz = await generateTodayQuiz(req.user.id);

    if (!quiz) {
        return res.json({ success: false, data: null });
    }

    res.json({ success: true, data: quiz });
});

module.exports = router;