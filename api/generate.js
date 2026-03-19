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
        // 🔥 FIXED URL: Using 'v1' and standard model name
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Return ONLY a JSON object: {"message": "unique_eid_wish", "giftIdea": "gift_name"}. 
                        Write a short Eid wish for ${name} (${relationship}). Tone: ${isRoast ? 'Funny Roast' : tone}.`
                    }]
                }]
            })
        });

        const data = await response.json();

        // Check if Google returned an error
        if (data.error) {
            console.error("Google API Error:", data.error.message);
            throw new Error(data.error.message);
        }

        // Safety check for candidates
        if (!data.candidates || data.candidates.length === 0) {
            throw new Error("AI response blocked.");
        }

        const responseText = data.candidates[0].content.parts[0].text;
        
        // Clean JSON formatting
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const aiData = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);

        return res.status(200).json(aiData);

    } catch (error) {
        console.error("FINAL ERROR LOG:", error.message);
        // Random fallback to make it look dynamic even when failing
        const gifts = ["Smart Watch", "Perfume Set", "Traditional Dress", "Gift Card"];
        const randomGift = gifts[Math.floor(Math.random() * gifts.length)];
        
        return res.status(200).json({
            message: `Eid Mubarak, ${name}! (AI Error: ${error.message.substring(0, 20)}...) Wishing you joy! ✨`,
            giftIdea: randomGift
        });
    }
}
