const express = require('express');
const app = express();

// JSON data parse korar jonno middleware
app.use(express.json());

// Main API Route jeta apnar frontend call korbe
app.post('/api/generate', (req, res) => {
    try {
        const { name, relationship, tone, isRoast } = req.body;

        let message = "";
        let giftIdea = "";

        // Message ebong Gift generate korar logic
        if (isRoast) {
            message = `Eid Mubarak, ${name}! Bhabechilam kono bhalo gift dibo, kintu tomar chehara tai ekta boro joke! 😂`;
            giftIdea = "Ekta ayna (Mirror), jate nijei dekhe haste paro!";
        } else if (tone === 'funny') {
            message = `Eid Mubarak ${name}! Asha kori eibar amar theke Eidi chawa bondho korbe! 💸`;
            giftIdea = "Ekta khali wallet, karon sob Eidi to ami niye nibo!";
        } else if (tone === 'romantic' || relationship === 'partner') {
            message = `Eid Mubarak my love, ${name}. Tumi asha tei amar Eid poripurno hoyeche. ❤️`;
            giftIdea = "Ekta shundor watch ar ekta golap f फूल (Rose). 🌹";
        } else {
            message = `Eid Mubarak, ${name}! Wishing you peace, happiness, and a lot of sweet moments with your family. ✨`;
            giftIdea = "Ekta traditional punjabi/kameez ba ek box premium sweets. 🍬";
        }

        // Frontend-e response pathano
        res.status(200).json({
            message: message,
            giftIdea: giftIdea
        });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Server-e kono somossya hoyeche!" });
    }
});

// Vercel-er jonno eta khub-i guruttopurno (app.listen thakbe na)
module.exports = app;
