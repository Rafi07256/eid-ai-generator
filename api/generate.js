export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: "Only POST allowed" });

    const { name = "Friend", relationship = "friend", tone = "normal", isRoast = false } = req.body || {};
    const API_KEY = process.env.GEMINI_API_KEY;

    try {
        // 🔥 Model name updated to 'gemini-1.5-pro' for better stability
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Write a short, unique Eid Mubarak greeting for my ${relationship} named ${name}. Tone: ${isRoast ? 'Funny Roast' : tone}. Suggest 1 gift. Output strictly in JSON format: {"message": "text", "giftIdea": "text"}`
                    }]
                }]
            })
        });

        const data = await response.json();

        // Error handling if API fails
        if (data.error) {
            console.error("Gemini Error:", data.error.message);
            throw new Error(data.error.message);
        }

        const responseText = data.candidates[0].content.parts[0].text;
        
        // Clean and Parse JSON
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const aiData = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);

        return res.status(200).json({
            message: aiData.message,
            giftIdea: aiData.giftIdea
        });

    } catch (error) {
        console.error("Final Log:", error.message);
        // User-ke unique fallback deya jate static na mone hoy
        return res.status(200).json({
            message: `Eid Mubarak, ${name}! Wishing you a day full of joy and happiness. (AI is slightly busy, but the wishes are real!)`,
            giftIdea: "A customized Eid gift hamper or a traditional dress."
        });
    }
}
