import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: "Only POST allowed" });

    try {
        const { name = "Friend", relationship = "friend", tone = "normal", isRoast = false } = req.body || {};

        // Vercel-er GEMINI_API_KEY use kora
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // AI Prompt
        let prompt = `Create a short, creative Eid Mubarak greeting for my ${relationship} named ${name}. `;
        if (isRoast) {
            prompt += "Make it a lighthearted roast! Tease them about eating too much or forgetting to give Eidi. ";
        } else if (tone === 'romantic') {
            prompt += "Make it sweet, romantic and poetic. ";
        } else {
            prompt += "Make it warm, traditional and thoughtful. ";
        }
        
        prompt += `Also suggest 1 gift idea. 
        You MUST respond ONLY with a raw JSON object: 
        {"message": "the_greeting", "giftIdea": "the_gift"}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // 🔥 CRITICAL: AI-er response theke JSON tuku ber korar safe way
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("AI did not return a valid JSON format");
        }

        const aiData = JSON.parse(jsonMatch[0]);

        return res.status(200).json({
            message: aiData.message,
            giftIdea: aiData.giftIdea
        });

    } catch (error) {
        console.error("AI Error:", error);
        // Fallback response: Jodi AI crash kore, jeno user kichu dekhte pay
        return res.status(200).json({
            message: `Eid Mubarak, ${req.body.name || 'Friend'}! Wishing you a day full of joy and blessings. ✨`,
            giftIdea: "A box of premium traditional sweets (Ladoo or Baklava)."
        });
    }
}
