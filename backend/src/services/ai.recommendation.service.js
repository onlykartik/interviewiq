const pool = require('../config/db');
const { askAI } = require('./ai.service');
const buildPrompt = require('./prompts/recommendedTopics.prompt');
const { safeJsonParse } = require('../utils/safeJsonParse');

async function generateRecommendedTopics(userId) {
    console.log('generateRecommendedTopics==>')
    const questionRes = await pool.query(
        `SELECT question_text, difficulty
        FROM questions
        WHERE user_id = $1`,
        [userId]
    );

    if (questionRes.rows.length === 0) return null;

    const prompt = buildPrompt(questionRes.rows);
    console.log('Prompt', prompt)
    const aiRaw = await askAI(prompt);
    console.log('aiRaw', aiRaw)
    const aiData = safeJsonParse(aiRaw);
    console.log('aiData', aiData)

    if (!aiData || !aiData.recommended_topics) return null;

    await pool.query(
    `
    INSERT INTO user_ai_recommendations
    (user_id, recommended_topics, last_generated_at)
    VALUES ($1, $2, now())
    ON CONFLICT (user_id)
    DO UPDATE SET
        recommended_topics = EXCLUDED.recommended_topics,
        last_generated_at = now()
    `,
    [userId, JSON.stringify(aiData.recommended_topics)]
    );

    return aiData.recommended_topics;
}

module.exports = { generateRecommendedTopics };