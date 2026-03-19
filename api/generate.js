import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: "Only POST allowed" });

    try {
        const { name = "Friend", relationship = "friend", tone = "normal", isRoast = false } = req.body || {};

        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is missing!");
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // Model setup - 'gemini-1.5-flash' name-ta fix kora hoyeche
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Write a short, unique Eid Mubarak greeting for my ${relationship} named ${name}. 
        Tone: ${isRoast ? 'Funny Roast' : tone}. 
        Suggest 1 creative gift. 
        Return ONLY a JSON object like this: {"message": "greeting text", "giftIdea": "gift name"}`;

        // AI generate kora
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();

        // Safe JSON parsing
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("AI response was not valid JSON");
        
        const aiData = JSON.parse(jsonMatch[0]);

        return res.status(200).json({
            message: aiData.message,
            giftIdea: aiData.giftIdea
        });

    } catch (error) {
        console.error("CRITICAL AI ERROR:", error.message);
        // Fallback message jate user blank na dekhe
        return res.status(200).json({
            message: `Eid Mubarak, ${req.body.name || 'Friend'}! Wishing you a peaceful and joyous Eid. ✨`,
            giftIdea: "A box of delicious traditional sweets."
        });
    }
}
