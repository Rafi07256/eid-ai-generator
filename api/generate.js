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
        // 🔥 FIXED URL: Using 'v1beta' with full model path as per Google's latest change
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Write a short, unique Eid Mubarak greeting for my ${relationship} named ${name}. 
                        Tone: ${isRoast ? 'Funny Roast' : tone}. 
                        Suggest 1 creative gift. 
                        Return ONLY a JSON object: {"message": "text", "giftIdea": "text"}`
                    }]
                }]
            })
        });

        const data = await response.json();

        // Error log for debugging
        if (data.error) {
            throw new Error(`Google says: ${data.error.message}`);
        }

        if (!data.candidates || data.candidates.length === 0) {
            throw new Error("AI blocked the response (Safety Filter).");
        }

        const responseText = data.candidates[0].content.parts[0].text;
        
        // Clean and Parse JSON
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const aiData = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);

        return res.status(200).json(aiData);

    } catch (error) {
        console.error("LOG:", error.message);
        // Fallback message with randomness
        const fallbacks = [
            { m: `Eid Mubarak, ${name}! AI ektu busy, kintu tomar Eid jeno shera hoy!`, g: "Ekta bhalo smart watch." },
            { m: `Eid Mubarak, ${name}! All the best to you and your family.`, g: "A set of premium perfumes." }
        ];
        const resObj = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        return res.status(200).json({ message: resObj.m, giftIdea: resObj.g });
    }
}
