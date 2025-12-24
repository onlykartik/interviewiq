const express = require('express');
const router = express.Router();
const { askAI } = require('../services/ai.service');

router.get('/ping', async (req, res) => {
    const reply = await askAI('Say hello in one sentence.');
    res.json({ reply });
});

module.exports = router;