const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function askAI(prompt) {
    const response = await openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        messages: [
        {
            role: 'system',
            content: 'You are an expert interview preparation coach.',
        },
        {
            role: 'user',
            content: prompt,
        },
        ],
        temperature: 0.4,
        
    });

    return response.choices[0].message.content;
}

module.exports = { askAI };