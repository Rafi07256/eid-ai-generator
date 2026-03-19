export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: "Only POST allowed" });

    const { name = "Friend", relationship = "friend", tone = "normal", isRoast = false } = req.body || {};

    // --- AI chara amader boro wish list ---
    const greetings = [
        `Eid Mubarak, ${name}! Wishing you and your family a blessed Eid full of joy and happiness. ✨`,
        `Hey ${name}, Eid Mubarak! May this special day bring peace and prosperity to your life. 🌙`,
        `Eid Mubarak, ${name}! May your plate be full of Semai and your heart be full of joy!`,
        `Sending you warm hugs and lots of love on this Eid, ${name}. Have a wonderful day! 🥂`,
        `Eid Mubarak, ${name}! Wishing you a day as sweet as you are. Enjoy the festivities!`,
        `May the magic of this Eid bring lots of happiness in your life, ${name}. Mubarak!`,
        `Eid Mubarak, ${name}! May Allah bless you with health, wealth, and countless smiles.`,
        `Hey ${name}, hope your Eid is as amazing as our friendship. Eid Mubarak! 🌟`
    ];

    const roastGreetings = [
        `Eid Mubarak, ${name}! Eibar ki khali khaibi? Eidi ki dibi na? Kiptami bad de! 😂`,
        `Hey ${name}, Eid Mubarak! Beshi kore semai kha, kintu pet fulaish na abar! 🤰`,
        `Eid Mubarak, ${name}! Toke wish korlam, ekhon bhalo manusher moto ekti "Eidi" bikaash kor! 💸`,
        `Eid Mubarak! Asholei ki bhalo hoye goli, naki sudhu Eid er din-i eirokom? 😂`,
        `Hey ${name}, Eid Mubarak! Eidi na dile kintu shobai ke bole dibo tui koto boro kipta!`
    ];

    const romanticGreetings = [
        `Eid Mubarak, my love ${name}! My Eid is incomplete without you. ❤️`,
        `Wishing my favorite person ${name} a very happy Eid. Can't wait to see you! 😍`,
        `Eid Mubarak, ${name}! You are the best Eidi I have ever received in my life.`,
        `To the person who makes my every day feel like Eid, Eid Mubarak ${name}! ✨❤️`
    ];

    const gifts = [
        "A stylish Smart Watch ⌚",
        "A box of premium Ferrero Rocher 🍫",
        "A customized Coffee Mug with your name ☕",
        "A set of traditional Panjabi or Dress 👗",
        "A premium Arabian Perfume (Attar) 🌸",
        "A beautiful indoor plant for your room 🪴",
        "A pair of trendy Sneakers 👟",
        "A gift voucher from your favorite brand 🎟️"
    ];

    // --- Randomly Selection Logic ---
    let selectedMessages;
    if (isRoast) {
        selectedMessages = roastGreetings;
    } else if (tone === 'romantic') {
        selectedMessages = romanticGreetings;
    } else {
        selectedMessages = greetings;
    }

    // Ekta random message ar gift pick kora
    const finalMessage = selectedMessages[Math.floor(Math.random() * selectedMessages.length)];
    const finalGift = gifts[Math.floor(Math.random() * gifts.length)];

    return res.status(200).json({
        message: finalMessage,
        giftIdea: finalGift
    });
}
