function safeJsonParse(text) {
  if (!text || typeof text !== 'string') return null;

  try {
    return JSON.parse(text);
  } catch (err) {
    // Attempt to extract JSON block
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1) {
      const possibleJson = text.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(possibleJson);
      } catch {
        return null;
      }
    }
    return null;
  }
}

module.exports = { safeJsonParse };