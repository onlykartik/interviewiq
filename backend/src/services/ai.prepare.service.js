const { askAI } = require('./ai.service');

function extractJson(raw) {
  if (!raw) return null;

  return raw
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();
}

async function generatePrepQuestions({
  company,
  role,
  experience_level,
  location,
  job_description
}) {
  const prompt = `
You are an interview preparation expert.

Generate 8–10 likely interview questions.

Company: ${company}
Role: ${role}
Experience Level: ${experience_level}
Location: ${location}

Job Description:
${job_description}

Rules:
- Focus on real interview questions
- Mix theory + practical
- Avoid generic questions
- Prefer questions repeatedly asked across companies
- Avoid academic or theoretical-only questions
- Include common follow-up questions implicitly
- Focus on evaluation criteria interviewers use
- Return ONLY a JSON array (no markdown, no explanations)
- Each item should be a string question
`;

  const raw = await askAI(prompt);

  console.log('RAW AI OUTPUT:', raw);

  try {
    const cleaned = extractJson(raw);
    const parsed = JSON.parse(cleaned);

    // ✅ Optional: normalize format
    // If AI returns [{question: "..."}] → convert to strings
    if (Array.isArray(parsed) && typeof parsed[0] === 'object') {
      return parsed.map(q => q.question).filter(Boolean);
    }

    return parsed;
  } catch (err) {
    console.error('AI JSON parse failed:', err.message);
    return [];
  }
}

module.exports = { generatePrepQuestions };