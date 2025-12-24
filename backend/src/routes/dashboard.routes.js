const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/dashboard/upcoming
router.get('/upcoming', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        const query = `
        SELECT
            i.id,
            i.role,
            i.interview_date,
            c.name AS company_name
        FROM interviews i
        JOIN companies c ON i.company_id = c.id
        WHERE i.user_id = $1
            AND i.interview_date >= CURRENT_DATE
        ORDER BY i.interview_date ASC
        LIMIT 3
        `;

        const result = await pool.query(query, [userId]);

        res.json({
        success: true,
        data: result.rows
        });

    } catch (error) {
        console.error('Upcoming interviews error:', error.message);
        res.status(500).json({ success: false });
    }
    });

    // GET /api/dashboard/stats
    router.get('/stats', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        const interviewsCount = await pool.query(
        'SELECT COUNT(*) FROM interviews WHERE user_id = $1',
        [userId]
        );

        const questionsCount = await pool.query(
        'SELECT COUNT(*) FROM questions WHERE user_id = $1',
        [userId]
        );

        const companiesCount = await pool.query(
        `
        SELECT COUNT(DISTINCT company_id)
        FROM interviews
        WHERE user_id = $1
        `,
        [userId]
        );

        res.json({
        success: true,
        data: {
            interviews: Number(interviewsCount.rows[0].count),
            questions: Number(questionsCount.rows[0].count),
            companies: Number(companiesCount.rows[0].count)
        }
        });

    } catch (error) {
        console.error('Stats error:', error.message);
        res.status(500).json({ success: false });
    }
});

const { generateDailyDashboard } = require('../services/dashboard.ai.service');

router.get('/ai-recommendation', auth, async (req, res) => {
    const userId = req.user.id;
    const data = await generateDailyDashboard(userId);
    res.json({
        success: true,
        data
    });
});

const { recordRefresh,canRefreshRecommendation, getDashboardRecommendations } = require('../services/dashboard.ai.service');

/**
 * GET dashboard recommendations
 */
router.get('/recommendations', auth, async (req, res) => {
    const data = await getDashboardRecommendations(req.user.id);

    res.json({
        success: true,
        data: data.topics,
        remaining: data.remaining
    });
});

const {
    generateRecommendedTopics
} = require('../services/ai.recommendation.service');

/**
 * POST refresh recommendations
 */
// routes/dashboard.routes.js
// routes/dashboard.routes.js
router.post('/recommendations/refresh', auth, async (req, res) => {
    const userId = req.user.id;

    const limit = await canRefreshRecommendation(userId);

    console.log('IN /recommendations/refresh', limit)

    if (!limit.allowed) {
        return res.status(429).json({
        success: false,
        message: 'Refresh limit reached',
        remaining: 0
        });
    }

    
    const topics = await generateRecommendedTopics(userId);

    // Record refresh
    await recordRefresh(userId);

    // 🔥 Recalculate remaining AFTER increment
    const updatedLimit = await canRefreshRecommendation(userId);

    res.json({
        success: true,
        data: topics,
        remaining: updatedLimit.remaining
    });
});

module.exports = router;