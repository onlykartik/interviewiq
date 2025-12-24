module.exports = function buildQuizPrompt(topics) {
  return `
You are an interview quiz generator.

Generate EXACTLY 10 multiple-choice questions based on these topics:
${topics.join(', ')}

RULES:
- Each question MUST have:
  - question
  - options (4)
  - correct_answer (must match one option EXACTLY)
  - explanation (1–2 lines)
- Return STRICT JSON ONLY
- NO markdown
- NO extra text

FORMAT:
{
  "questions": [
    {
      "question": "",
      "options": [],
      "correct_answer": "",
      "explanation": ""
    }
  ]
}
`;
};