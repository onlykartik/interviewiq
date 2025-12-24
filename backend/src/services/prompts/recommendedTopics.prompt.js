module.exports = function buildRecommendedTopicsPrompt(questions) {
  return `
You are an interview preparation assistant.

Given interview questions and their difficulty,
identify 4–6 TOPICS the user should revise.

Rules:
- Prefer MEDIUM and HARD questions
- Ignore vague wording
- Topics should be general (e.g. "SQL Joins", "Java Concurrency")
- Return ONLY valid JSON
- No explanation

JSON format:
{
  "recommended_topics": []
}

Questions:
${questions.map(q => `
Question: ${q.question_text}
Difficulty: ${q.difficulty}
`).join('\n')}
`;
};