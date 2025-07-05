const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.generateHints = async (req, res) => {
  const { problemStatement } = req.body;

  if (!problemStatement || problemStatement.trim() === '') {
    return res.status(400).json({ error: 'Problem statement is required.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Act like a helpful DSA tutor.
Provide 3 progressively helpful hints:
1. Direction (topic area)
2. Approach (strategy)
3. Key Implementation Tip

Problem:
${problemStatement}
    `;

    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const text = response.text();

    res.json({ hints: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate hints.' });
  }
};
