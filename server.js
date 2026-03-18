import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Smart Data Base (API ছাড়াই সুন্দর রেজাল্ট দেয়ার জন্য)
const database = {
    roast: {
        gifts: [
            "A high-quality mirror so you can finally see the real joke! 🤣",
            "An empty gift box. Because that's exactly what you deserve this year! 📦",
            "A dictionary, so you can finally learn how to talk sense. 📖",
            "My precious time. Just talking to you is enough Eidi! 😎"
        ],
        messages: [
            "Eid Mubarak [NAME]! Try not to eat all the meat alone, leave some for the humans.",
            "Happy Eid [NAME]! I was going to get you a great gift, but then I realized you already have me.",
            "Eid Mubarak! Please take a shower before you visit anyone today. 🚿"
        ]
    },
    romantic: {
        gifts: [
            "A beautiful custom necklace with our initials ❤️",
            "A matching couple's prayer mat (Janamaz) set. 🕌",
            "A jar filled with 100 handwritten notes about why I love you.",
            "A premium bouquet of red roses and their favorite chocolates. 🌹"
        ],
        messages: [
            "Eid Mubarak my love, [NAME]! Every Eid is special when I have you by my side. ❤️",
            "Wishing the most beautiful person, [NAME], a very Happy Eid. You are my greatest blessing.",
            "Eid Mubarak [NAME]! May our bond grow stronger and more beautiful with each passing day. 🥺"
        ]
    },
    funny: {
        gifts: [
            "A half-eaten box of premium dates. (I got hungry on the way) 😋",
            "A fake Eidi envelope with a 10 Taka note inside! 💵",
            "A matching funny t-shirt that says 'I am only here for the Biryani'. 🍛"
        ],
        messages: [
            "Eid Mubarak [NAME]! May your Biryani have more meat and fewer elachi today! 😂",
            "Happy Eid [NAME]! If you are planning to give me Eidi, bKash is also accepted. 📱",
            "Eid Mubarak! Eat as much as you can, diet starts tomorrow (or never). 🍔"
        ]
    },
    islamic: {
        gifts: [
            "A beautiful velvet Quran with a customized golden bookmark. 📖",
            "Premium Ajwa dates and original Zamzam water directly from Makkah. 🕋",
            "A luxury non-alcoholic Attar (perfume) set. ✨"
        ],
        messages: [
            "Eid Mubarak [NAME]! May Allah accept all our fasts, prayers, and good deeds. 🕌",
            "Wishing you a blessed Eid, [NAME]. May Allah's mercy and peace be upon you and your family.",
            "Eid Mubarak [NAME]! May this joyous day bring abundant blessings to your life."
        ]
    },
    emotional: {
        gifts: [
            "A memory scrapbook filled with our best pictures and moments. 📸",
            "A heartfelt handwritten letter expressing how much they mean to you. 💌",
            "A customized mug with a picture of a very special memory. ☕"
        ],
        messages: [
            "Eid Mubarak [NAME]! I am so grateful to have someone as amazing as you in my life. 🥺",
            "No matter how far we are, my prayers are always with you, [NAME]. Eid Mubarak!",
            "Happy Eid [NAME]! You bring so much joy to my life, thank you for always being there."
        ]
    }
};

// Random Item Selector
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

app.post('/api/generate', (req, res) => {
    try {
        const { name, relationship, tone, isRoast } = req.body;

        let category = "emotional"; // default

        // Logic to select the best category
        if (isRoast) category = "roast";
        else if (tone.includes("Romantic")) category = "romantic";
        else if (tone.includes("Funny")) category = "funny";
        else if (tone.includes("Islamic")) category = "islamic";
        else if (tone.includes("Emotional")) category = "emotional";

        // Get random gift and message
        const rawMessage = getRandom(database[category].messages);
        const giftIdea = getRandom(database[category].gifts);

        // Replace [NAME] with the actual user's name
        const finalMessage = rawMessage.replace("[NAME]", name);

        // Simulate AI "Thinking" Delay (1.5 seconds) for realistic feel
        setTimeout(() => {
            res.json({
                giftIdea: giftIdea,
                message: finalMessage
            });
        }, 1500);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 App is running flawlessly on http://localhost:${PORT}`));