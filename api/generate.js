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
        // 🔥 FIXED URL: v1beta bebohar korchi karon ota flash model-er jonno beshi stable
        // Models path-ta ektu bhabe likha hoyeche jeta 100% kaj korar kotha
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Return ONLY a JSON object: {"message": "text", "giftIdea": "text"}. 
                        Write a short Eid wish for ${name} (${relationship}). Tone: ${isRoast ? 'Funny Roast' : tone}.`
                    }]
                }]
            })
        });

        const data = await response.json();

        // Error checking directly from Google
        if (data.error) {
            console.error("GOOGLE_ERROR:", data.error.message);
            throw new Error(data.error.message);
        }

        if (!data.candidates || data.candidates.length === 0) {
            throw new Error("AI blocked response");
        }

        const responseText = data.candidates[0].content.parts[0].text;
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const aiData = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);

        return res.status(200).json(aiData);

    } catch (error) {
        console.error("FINAL_DEBUG:", error.message);
        
        // Dynamic fallback jate user blank na dekhe
        const gifts = ["Smart Watch", "Perfume", "Dress", "Chocolates"];
        return res.status(200).json({
            message: `Eid Mubarak, ${name}! Wishing you a day full of joy! ✨ (AI ektu jhamela korche, kintu amar suvechcha thik-i pouchabe!)`,
            giftIdea: gifts[Math.floor(Math.random() * gifts.length)]
        });
    }
}
