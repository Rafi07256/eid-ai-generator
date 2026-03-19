export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: "Only POST allowed" });

    const { name = "Bondhu", relationship = "Friend", tone = "Funny 😂" } = req.body || {};

    // --- 🕋 ISLAMIC CATEGORY (20 Wishes) ---
    const islamicWishes = [
        `Eid Mubarak, ${name}! May Allah shower his countless blessings upon you and your family. 🕋`,
        `Wishing you a blessed Eid, ${name}. May your prayers be answered and faith strengthened.`,
        `Eid Mubarak! May Allah accept your fasting, prayers, and sacrifices, ${name}.`,
        `May the peace of Islam bring joy to your heart this Eid, ${name}. Stay blessed!`,
        `Eid Mubarak, ${name}! May the light of Allah guide you to the path of success.`,
        `Wishing you an Eid full of Taqwa and blessings, ${name}. 🌙`,
        `Eid Mubarak, ${name}! May Allah bless your home with happiness and health.`,
        `May this Eid bring you closer to the Almighty and fill your life with barakah, ${name}.`,
        `Eid Mubarak! Praying for your well-being and prosperity in this life and hereafter, ${name}.`,
        `Wishing you a very happy and spiritual Eid, ${name}. Stay safe!`,
        `May Allah’s mercy be with you today and always. Eid Mubarak, ${name}!`,
        `Eid Mubarak, ${name}! May your day be filled with the serenity of Iman.`,
        `Wishing you an Eid that brings you closer to Allah's divine grace, ${name}.`,
        `Eid Mubarak! May the Noor of this day illuminate your soul, ${name}.`,
        `Sending you prayers and peace on this holy occasion. Eid Mubarak, ${name}!`,
        `May Allah grant you the strength to be the best version of yourself. Eid Mubarak, ${name}!`,
        `Eid Mubarak! May your heart find contentment in the remembrance of Allah, ${name}.`,
        `Wishing you a soulful Eid celebration with your family, ${name}.`,
        `May the blessings of Allah be the light that guides your way. Eid Mubarak, ${name}!`,
        `Eid Mubarak, ${name}! May your life be as beautiful as the teachings of Islam.`
    ];

    // --- 😂 FUNNY / ROAST CATEGORY (25 Wishes) ---
    const funnyWishes = [
        `Eid Mubarak, ${name}! Eidi bikaash kor druto, nahole tor bashay giye shob semai kheye ashbo! 💸`,
        `Hey ${name}, Eid Mubarak! Tui jedin Eidi dibi, sedin asholei "Eid" hobe! 😜`,
        `Eid Mubarak! Tui ki ekhono bachcha ashis? Eidi chachis keno? 😂`,
        `Eid Mubarak, ${name}! Hope your face looks better than the Qurbani cow today! 🐮`,
        `Hey ${name}, Eid Mubarak! Beshi kore kha, kintu pet fulaish na abar! 🤰`,
        `Eid Mubarak! If being annoying was a job, you'd be a billionaire, ${name}! 😂`,
        `Eid Mubarak, ${name}! Go take a shower first, then ask for Eidi! 🚿`,
        `Hey ${name}, Eid Mubarak! Stop acting like a celebrity today, tui shei bolod-i achis! 😂`,
        `Eid Mubarak! Tui jedin nijer taka diye khawabi, sedin asholei khushi hobo, ${name}!`,
        `Eid Mubarak, ${name}! Salamir taka patha, nahole tor "crush" er kache tor shob gopon fash kore dibo! 🙊`,
        `Hey ${name}, Eid Mubarak! May your stomach be strong enough for all that food!`,
        `Eid Mubarak! Jotoi sajis, tui kintu shei purono pacha-i thakbi, ${name}! 😂`,
        `Eid Mubarak! Hoping you get more Eidi than the weight of your ego! 💸`,
        `Hey ${name}, Eid Mubarak! Eidi dibi naki bhalo manusher mukho-sh pore thakbi?`,
        `Eid Mubarak! Wishing you a day free of your own drama, ${name}!`,
        `Eid Mubarak, ${name}! Tor kach theke ekti "Eidi" pawa mane 'Amabashyar Chand' pawa! 🌙`,
        `Hey ${name}, Eid Mubarak! Don't eat too much, or you'll need new pants!`,
        `Eid Mubarak! Hope your Eidi collection is bigger than your bank balance, ${name}!`,
        `Eid Mubarak, ${name}! May your neighbor's food taste better than your own today!`,
        `Hey ${name}, Eid Mubarak! Tui ki asholei manush naki Eid er kurbanir gorur hash-faash? 😂`,
        `Eid Mubarak! Salamir kotha bollen "Sim Not Found" hoye jash keno? ${name}!`,
        `Eid Mubarak! Wishing you enough Eidi to buy some common sense! 🧠`,
        `Hey ${name}, Eid Mubarak! Ajke kintu kawkew dhorlei Eidi chabi na!`,
        `Eid Mubarak! Jotoi "Surma" lagas, tor "Bolod" marka face kintu lukate parbi na!`,
        `Eid Mubarak, ${name}! Stay safe and keep your kiptami away for today!`
    ];

    // --- ❤️ ROMANTIC / CRUSH CATEGORY (20 Wishes) ---
    const romanticWishes = [
        `Eid Mubarak, my love ${name}! My Eid is always better because you are in it. ❤️`,
        `Wishing my favorite person ${name} a very happy Eid. Can't wait to see you today! 😍`,
        `Eid Mubarak, ${name}! You are the most beautiful gift Allah has ever given me. 🎁`,
        `To the person who makes my life feel like a festival every day, Eid Mubarak ${name}! ✨`,
        `Eid Mubarak, ${name}! You are the moon of my life. 🌙❤️`,
        `Wishing you a sweet Eid full of love, my dear ${name}. You mean the world to me.`,
        `Eid Mubarak! My only prayer this Eid is to have you by my side forever, ${name}.`,
        `Hey ${name}, you look stunning today! Eid Mubarak, my soulmate. ✨`,
        `Eid Mubarak to the one who rules my heart, ${name}. ❤️`,
        `May our love grow stronger with every Eid celebration, ${name}.`,
        `Eid Mubarak, ${name}! I feel so lucky to celebrate this day with you.`,
        `Happy Eid to my one and only, ${name}! ❤️✨`,
        `Eid Mubarak! Looking forward to many more Eids together, ${name}.`,
        `You are my happiness, ${name}. Have a wonderful and romantic Eid!`,
        `Eid Mubarak, ${name}! Let's create some beautiful memories today.`,
        `To my dearest ${name}, Eid Mubarak! You are my everything. ❤️`,
        `Eid Mubarak! Your smile is the only Eidi I ever wanted, ${name}.`,
        `Sending you a thousand kisses and warm Eid wishes, ${name}! 😘`,
        `Eid Mubarak, ${name}! My heart beats only for you, especially today.`,
        `May Allah keep us together forever. Eid Mubarak, my love ${name}!`
    ];

    // --- 🥺 EMOTIONAL CATEGORY (15 Wishes) ---
    const emotionalWishes = [
        `Eid Mubarak, ${name}. Missing the old days when we used to celebrate together. 🥺`,
        `Sending you lots of love and prayers this Eid, ${name}. You are always in my heart.`,
        `Eid Mubarak, ${name}. May this day bring healing and peace to your soul. ✨`,
        `No matter how far we are, my prayers are always with you. Eid Mubarak, ${name}.`,
        `Eid Mubarak! Wishing you strength and happiness in every step of your life, ${name}.`,
        `Eid Mubarak, ${name}. Life moves on, but the memories of our Eids remain.`,
        `Wishing you a peaceful Eid, ${name}. May your sorrows vanish with this moon.`,
        `Eid Mubarak! Thinking of you and sending my warmest regards, ${name}.`,
        `May this Eid fill your life with the light of hope, ${name}. Stay strong.`,
        `Eid Mubarak, ${name}. Distance can't stop me from wishing you the best today.`,
        `Wishing you an Eid that brings you comfort and serenity, ${name}.`,
        `Eid Mubarak! May your heart find the peace it has been searching for, ${name}.`,
        `Sending a silent prayer for you this Eid. Eid Mubarak, ${name}. 🥺`,
        `Eid Mubarak, ${name}. May Allah grant you the patience and joy you deserve.`,
        `Missing your presence today. Have a blessed and meaningful Eid, ${name}.`
    ];

    // --- 🎁 MEGA GIFT LIST (35 Ideas) ---
    const gifts = [
        "A stylish Smart Watch ⌚", "A box of premium Ferrero Rocher 🍫", "A customized Coffee Mug ☕",
        "A set of traditional Panjabi/Dress 👗", "A premium Arabian Perfume 🌸", "A beautiful indoor plant 🪴",
        "A pair of trendy Sneakers 👟", "A leather Wallet or Handbag 👜", "A Polaroid Camera 📸",
        "A box of traditional sweets 🍮", "Trendy Sunglasses 🕶️", "A customized Keychain 🔑",
        "A premium Skincare Gift Set ✨", "A soft Eid Cushion 🛋️", "A collection of Books 📚",
        "Wireless Earbuds 🎧", "A stylish Belt 👔", "A elegant Saree 👘", "A minimalist Necklace 📿",
        "A box of assorted Nuts 🥜", "A personalized Photo Frame 🖼️", "A portable Power Bank 🔋",
        "A scented Candle Set 🕯️", "A subscription to a streaming service 📺", "A cool Cap or Hat 🧢",
        "A travel Pillow ✈️", "A beautiful Prayer Mat (Jainamaz) 🕋", "A digital Tasbih 📿",
        "A box of premium Dates (Khujur) 🌴", "A grooming kit for men 🪒", "A stylish Hijab set 🧕",
        "A customized Diary/Planner 📖", "A box of colorful Macarons 🧁", "A set of high-quality Pens 🖋️",
        "An Amazon/Netflix Gift Card 🎟️"
    ];

    // --- LOGIC ---
    let pool;
    if (tone.includes("Islamic")) pool = islamicWishes;
    else if (tone.includes("Funny")) pool = funnyWishes;
    else if (tone.includes("Romantic")) pool = romanticWishes;
    else if (tone.includes("Emotional")) pool = emotionalWishes;
    else pool = islamicWishes;

    // Cross-check Relationship for Crush/GF/BF
    if ((relationship === "Crush" || relationship === "Girlfriend" || relationship === "Boyfriend") && !tone.includes("Funny")) {
        pool = [...pool, ...romanticWishes];
    }

    const finalMessage = pool[Math.floor(Math.random() * pool.length)];
    const finalGift = gifts[Math.floor(Math.random() * gifts.length)];

    return res.status(200).json({ message: finalMessage, giftIdea: finalGift });
}
