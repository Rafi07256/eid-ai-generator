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
        // 🔥 STABLE URL: Using gemini-1.5-pro which has better regional support
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Return ONLY a raw JSON object: {"message": "greeting", "giftIdea": "gift"}. 
                        Write a short, unique Eid Mubarak wish for my ${relationship} named ${name}. 
                        Tone: ${isRoast ? 'funny roast' : tone}.`
                    }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(`Google Error: ${data.error.message}`);
        }

        if (!data.candidates || data.candidates.length === 0) {
            throw new Error("AI response was blocked.");
        }

        const responseText = data.candidates[0].content.parts[0].text;
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const aiData = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);

        return res.status(200).json(aiData);

    } catch (error) {
        console.error("FINAL_DEBUG_LOG:", error.message);
        
        // Dynamic Fallback
        const giftList = ["Smart Watch", "Perfume", "Punjabi", "Gift Voucher"];
        const randomGift = giftList[Math.floor(Math.random() * giftList.length)];
        
        return res.status(200).json({
            message: `Eid Mubarak, ${name}! Wishing you joy and blessings! ✨ (AI is taking a break, but my wishes are 100% AI-free!)`,
            giftIdea: randomGift
        });
    }
}
