const pool = require('../config/db');
const { askAI } = require('./ai.service');
const buildQuizPrompt = require('./prompts/quiz.prompt');
const { safeJsonParse } = require('../utils/safeJsonParse');

async function generateTodayQuiz(userId) {
  // 1️⃣ Check cache
    const cached = await pool.query(
        `SELECT * FROM user_daily_quiz WHERE user_id=$1`,
        [userId]
    );

    if (cached.rows.length > 0) {
        return cached.rows[0].questions;
    }

    const recRes = await pool.query(
        `SELECT recommended_topics FROM user_ai_recommendations WHERE user_id=$1`,
        [userId]
    );

    if (recRes.rows.length === 0) return null;

    const topics = recRes.rows[0].recommended_topics;

    const prompt = buildQuizPrompt(topics);
    const aiRaw = await askAI(prompt);
    const aiData = safeJsonParse(aiRaw);

    if (!aiData || !aiData.questions) return null;

    aiData.questions = aiData.questions.filter(q =>
    q.correct_answer &&
    q.options.includes(q.correct_answer)
    );

    if (aiData.questions.length === 0) {
    throw new Error('AI returned invalid quiz questions');
    }

  // 4️⃣ Store quiz
    await pool.query(
        `
        INSERT INTO user_daily_quiz (user_id, topics, questions)
        VALUES ($1,$2,$3)
        ON CONFLICT (user_id)
        DO UPDATE SET
        topics = EXCLUDED.topics,
        questions = EXCLUDED.questions,
        generated_at = now()
        `,
        [userId, JSON.stringify(topics), JSON.stringify(aiData.questions)]
    );

    return aiData.questions;
}

module.exports = { generateTodayQuiz };