module.exports = (req, res) => {
    // Cross-Origin allow korar jonno (Jodi dorkar hoy)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // OPTIONS request handle kora
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Only POST method is allowed" });
    }

    try {
        // Jodi req.body kono karone khali ashe, tahole crash thekate default empty object
        const body = req.body || {};
        const name = body.name || "Friend";
        const relationship = body.relationship || "";
        const tone = body.tone || "normal";
        const isRoast = body.isRoast || false;

        let message = "";
        let giftIdea = "";

        if (isRoast) {
            message = `Eid Mubarak, ${name}! Bhabechilam kono bhalo gift dibo, kintu tomar chehara tai ekta boro joke! 😂`;
            giftIdea = "Ekta ayna (Mirror), jate nijei dekhe haste paro!";
        } else if (tone === 'funny') {
            message = `Eid Mubarak ${name}! Asha kori eibar amar theke Eidi chawa bondho korbe! 💸`;
            giftIdea = "Ekta khali wallet, karon sob Eidi to ami niye nibo!";
        } else if (tone === 'romantic' || relationship === 'partner') {
            message = `Eid Mubarak my love, ${name}. Tumi asha tei amar Eid poripurno hoyeche. ❤️`;
            giftIdea = "Ekta shundor watch ar ekta golap ful (Rose). 🌹";
        } else {
            message = `Eid Mubarak, ${name}! Wishing you peace, happiness, and a lot of sweet moments with your family. ✨`;
            giftIdea = "Ekta traditional punjabi/kameez ba ek box premium sweets. 🍬";
        }

        return res.status(200).json({
            message: message,
            giftIdea: giftIdea
        });

    } catch (error) {
        console.error("Function Error:", error);
        return res.status(500).json({ error: "Server-e kono somossya hoyeche!" });
    }
};
