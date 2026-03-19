import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // CORS configuration
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: "Only POST allowed" });

    try {
        const { name = "Friend", relationship = "friend", tone = "normal", isRoast = false } = req.body || {};

        // Gemini AI Initializing using your Vercel Environment Variable
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Creating the AI Prompt
        let prompt = `Write a short, unique Eid Mubarak greeting for my ${relationship} named ${name}. `;
        if (isRoast) {
            prompt += "Make it a funny roast! Tease them about eating too much or not giving Eidi. ";
        } else if (tone === 'romantic') {
            prompt += "Make it sweet and romantic. ";
        } else {
            prompt += "Make it warm and traditional. ";
        }
        
        prompt += `Suggest one creative gift idea. Return ONLY a JSON object: {"message": "greeting", "giftIdea": "gift"}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Cleaning AI response if it contains markdown
        const cleanJsonText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        const aiData = JSON.parse(cleanJsonText);

        return res.status(200).json({
            message: aiData.message,
            giftIdea: aiData.giftIdea
        });

    } catch (error) {
        console.error("AI Error:", error);
        return res.status(500).json({ error: "Failed to generate AI message" });
    }
}
