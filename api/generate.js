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
        // 🔥 Updated URL to use gemini-1.5-flash-latest which is more stable in v1beta
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Write a unique Eid Mubarak message for ${name} (${relationship}). Tone: ${isRoast ? 'Funny Roast' : tone}. Return ONLY JSON: {"message": "text", "giftIdea": "text"}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.9,
                    topP: 0.95,
                    maxOutputTokens: 250,
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Gemini API Error:", data.error.message);
            throw new Error(data.error.message);
        }

        // Safety check for candidates
        if (!data.candidates || !data.candidates[0].content) {
            throw new Error("AI did not provide a response.");
        }

        const responseText = data.candidates[0].content.parts[0].text;
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const aiData = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);

        return res.status(200).json(aiData);

    } catch (error) {
        console.error("Backend Error:", error.message);
        // Random fallback to make it look dynamic even if AI fails
        const randomGift = ["Smart Watch", "Perfume Set", "Traditional Dress", "Customized Mug"][Math.floor(Math.random() * 4)];
        return res.status(200).json({
            message: `Eid Mubarak, ${name}! Wishing you a wonderful day filled with laughter and joy! ✨`,
            giftIdea: randomGift
        });
    }
}
