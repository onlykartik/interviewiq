module.exports = function buildQuestionAnalysisPrompt(questions) {
return `
You are an interview intelligence system.

Below are interview questions a user has faced.
They may be vague or incomplete.

Your tasks:
1. Identify real technical topics
2. Group related concepts
3. Detect weak areas
4. Ignore noise
5. Estimate difficulty honestly

Return STRICT JSON in this format:

{
    "core_topics": [],
    "weak_areas": [],
    "strong_areas": [],
    "recommended_focus": []
}

Questions:
${questions.map(q => `- ${q.question_text}`).join('\n')}
`;
};