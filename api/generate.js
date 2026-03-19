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
        // 🔥 ULTRA STABLE URL: Using gemini-pro on v1 endpoint
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Return ONLY a JSON object: {"message": "text", "giftIdea": "text"}. 
                        Write a unique Eid wish for ${name} (${relationship}). Tone: ${isRoast ? 'Funny Roast' : tone}.`
                    }]
                }]
            })
        });

        const data = await response.json();

        // Check for Google Error
        if (data.error) {
            throw new Error(data.error.message);
        }

        const responseText = data.candidates[0].content.parts[0].text;
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const aiData = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);

        return res.status(200).json(aiData);

    } catch (error) {
        console.error("FINAL_DEBUG:", error.message);
        
        // Random Dynamic Fallback (Jate static na mone hoy)
        const messages = [
            `Eid Mubarak, ${name}! Wishing you a day full of laughter and joy! ✨`,
            `Hey ${name}, Eid Mubarak! May your day be as sweet as semai! 🌙`,
            `Eid Mubarak, ${name}! Sending you lots of love and best wishes.`
        ];
        const gifts = ["Smart Watch", "Perfume", "Punjabi", "Chocolates", "Gift Voucher"];
        
        return res.status(200).json({
            message: messages[Math.floor(Math.random() * messages.length)],
            giftIdea: gifts[Math.floor(Math.random() * gifts.length)]
        });
    }
}
