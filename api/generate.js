export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: "Only POST allowed" });

    const { name = "Friend", relationship = "friend", tone = "normal", isRoast = false } = req.body || {};
    const API_KEY = process.env.GEMINI_API_KEY;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Write a short Eid Mubarak greeting for my ${relationship} named ${name}. Tone: ${isRoast ? 'Funny Roast' : tone}. Return ONLY JSON: {"message": "text", "giftIdea": "text"}`
                    }]
                }]
            })
        });

        const data = await response.json();

        // 🔥 DEBUGGING: Jodi Gemini error pathay
        if (data.error) {
            throw new Error(`Gemini API Error: ${data.error.message}`);
        }

        // 🔥 SAFE CHECKING: Candidates ache kina dekha
        if (!data.candidates || data.candidates.length === 0) {
            throw new Error("AI blocked the response or returned nothing.");
        }

        const responseText = data.candidates[0].content.parts[0].text;
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const aiData = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);

        return res.status(200).json({
            message: aiData.message,
            giftIdea: aiData.giftIdea
        });

    } catch (error) {
        console.error("LOG:", error.message);
        return res.status(200).json({
            message: `Eid Mubarak, ${name}! (Error: ${error.message})`,
            giftIdea: "A box of sweets."
        });
    }
}
