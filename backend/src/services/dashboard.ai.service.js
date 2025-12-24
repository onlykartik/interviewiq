const pool = require('../config/db');
const { generateRecommendedTopics } = require('./ai.recommendation.service');

async function getDashboardRecommendations(userId) {
  console.log('called getDashboardRecommendations')
  console.log(`[DASHBOARD] Fetching recommendations for user ${userId}`);
  const limit = await canRefreshRecommendation(userId);


  // 1️⃣ Check cache
  const cached = await pool.query(
    `
    SELECT recommended_topics
    FROM user_ai_recommendations
    WHERE user_id = $1
    `,
    [userId]
  );

  if (cached.rows.length > 0) {
    return {
      topics: cached.rows[0].recommended_topics,
      remaining: limit.remaining
    };
  }

  // 2️⃣ Generate using AI
  console.log('[DASHBOARD] No cache found. Calling AI...');
  const topics = await generateRecommendedTopics(userId);

  if (!topics) {
    console.warn('[DASHBOARD] No topics generated');
    return [];
  }

  console.log('[DASHBOARD] AI topics generated successfully');
  return { topics: topics || [], remaining: limit.remaining };
}

/**
 * Record a refresh
 */
async function recordRefresh(userId) {
  const result = await pool.query(
    `
    INSERT INTO user_recommendation_refresh
      (user_id, refresh_count, last_refresh_at)
    VALUES ($1, 1, CURRENT_DATE)
    ON CONFLICT (user_id)
    DO UPDATE SET
      refresh_count =
        CASE
          WHEN user_recommendation_refresh.last_refresh_at::date = CURRENT_DATE
          THEN user_recommendation_refresh.refresh_count + 1
          ELSE 1
        END,
      last_refresh_at = CURRENT_DATE
    RETURNING refresh_count
    `,
    [userId]
  );

  return result.rows[0].refresh_count;
}

/**
 * Check refresh limit
 */
async function canRefreshRecommendation(userId) {
  const MAX = 3;

  const res = await pool.query(
    `
    SELECT
      refresh_count,
      last_refresh_at::date AS last_date,
      CURRENT_DATE AS today
    FROM user_recommendation_refresh
    WHERE user_id = $1
    `,
    [userId]
  );

  // First time → allowed
  if (res.rows.length === 0) {
    return { allowed: true, remaining: MAX };
  }

  const { refresh_count, last_date, today } = res.rows[0];

  console.log(refresh_count, last_date, today, last_date !== today)

  // New day → reset count
  if (new Date(last_date).getTime() !== new Date(today).getTime()) {
  return { allowed: true, remaining: MAX };
}

  // Limit reached
  if (refresh_count >= MAX) {
    return { allowed: false, remaining: 0 };
  }

  return {
    allowed: true,
    remaining: MAX - refresh_count
  };
}



module.exports = { recordRefresh,canRefreshRecommendation, getDashboardRecommendations };