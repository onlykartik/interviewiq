const pool = require('../config/db');
const { askAI } = require('./ai.service');
const buildPrompt = require('./prompts/userProfile.prompt');

async function analyzeUserProfile(userId) {
  const questionRes = await pool.query(
    `SELECT question_text, difficulty, round
      FROM questions
      WHERE user_id = $1`,
    [userId]
  );

  if (questionRes.rows.length === 0) return null;

  const prompt = buildPrompt(questionRes.rows);
  console.log('Prompt \n' , prompt)
  const aiRaw = await askAI(prompt);
  console.log('aiRaw \n' , aiRaw)
  const aiData = JSON.parse(aiRaw);
  console.log('aiData \n' , aiData)

  await pool.query(`
    INSERT INTO user_ai_profile
      (user_id, core_topics, weak_topics, strong_topics,
        difficulty_gaps, learning_plan,
        question_count, last_analyzed_at, ai_version)
    VALUES ($1,$2,$3,$4,$5,$6,$7,now(),'v1')
    ON CONFLICT (user_id)
    DO UPDATE SET
      core_topics = EXCLUDED.core_topics,
      weak_topics = EXCLUDED.weak_topics,
      strong_topics = EXCLUDED.strong_topics,
      difficulty_gaps = EXCLUDED.difficulty_gaps,
      learning_plan = EXCLUDED.learning_plan,
      question_count = EXCLUDED.question_count,
      last_analyzed_at = now(),
      updated_at = now()
  `,
  [
    userId,
    aiData.core_topics,
    aiData.weak_topics,
    aiData.strong_topics,
    aiData.difficulty_gaps,
    aiData.learning_plan,
    questionRes.rows.length
  ]);

  // Mark all questions as analyzed
  await pool.query(
    `UPDATE questions SET analyzed = true WHERE user_id = $1`,
    [userId]
  );

  return aiData;
}

module.exports = { analyzeUserProfile };