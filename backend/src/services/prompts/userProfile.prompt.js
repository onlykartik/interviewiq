module.exports = function buildUserProfilePrompt(questions) {
  return `
You are an interview intelligence engine.

The user has answered interview questions.
They may be vague or inconsistent.

Your job:
1. Normalize topics
2. Identify weak areas
3. Identify strong areas
4. Detect difficulty gaps
5. Recommend a focused learning plan

Return STRICT JSON only.

Format:
{
  "core_topics": [],
  "weak_topics": [],
  "strong_topics": [],
  "difficulty_gaps": {},
  "learning_plan": []
}

Questions:
${questions.map(q => `
Question: ${q.question_text}
Difficulty: ${q.difficulty || 'unknown'}
Round: ${q.round || 'unknown'}
`).join('\n')}
`;
};