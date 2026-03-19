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
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Write a short, unique Eid Mubarak greeting for my ${relationship} named ${name}. 
                        Tone: ${isRoast ? 'Funny Roast' : tone}. 
                        Suggest 1 creative gift. 
                        Return ONLY a JSON object: {"message": "greeting_text", "giftIdea": "gift_name"}`
                    }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) throw new Error(data.error.message);

        const responseText = data.candidates[0].content.parts[0].text;
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const aiData = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);

        return res.status(200).json(aiData);

    } catch (error) {
        console.error("DEBUG LOG:", error.message);
        // Fallback message with randomness to ensure it's not always the same
        const fallbacks = [
            { m: `Eid Mubarak, ${name}! Wishing you joy!`, g: "A nice Punjabi/Dress." },
            { m: `Hey ${name}, have a great Eid!`, g: "A box of chocolates." }
        ];
        const random = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        return res.status(200).json({ message: random.m, giftIdea: random.g });
    }
}
