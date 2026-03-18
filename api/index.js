// app.js

const form = document.getElementById('generator-form');
const formSection = document.getElementById('form-section');
const loading = document.getElementById('loading');
const resultSection = document.getElementById('result-section');

// Safe Base64 encode/decode for Unicode
function encodeBase64Unicode(obj) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
}

function decodeBase64Unicode(str) {
    return JSON.parse(decodeURIComponent(escape(atob(str))));
}

// On Page Load: Check if it's a shared link
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('data');

    if (sharedData) {
        try {
            const decodedData = decodeBase64Unicode(sharedData);
            showResult(decodedData.name, decodedData.message, decodedData.giftIdea);
            triggerConfetti();
        } catch (e) {
            console.error("Invalid share link");
        }
    }
});

// Form Submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const relationship = document.getElementById('relationship').value;
    const tone = document.getElementById('tone').value;
    const isRoast = document.getElementById('roast-mode').checked;

    // UI Updates
    formSection.classList.add('hidden');
    loading.classList.remove('hidden');

    try {
        // Use absolute URL to avoid relative path issues
        const apiURL = `${window.location.origin}/api/generate`;

        const response = await fetch(apiURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, relationship, tone, isRoast })
        });

        if (!response.ok) throw new Error('API Error');

        const data = await response.json();

        // Update URL for sharing
        const shareObj = { name, message: data.message, giftIdea: data.giftIdea };
        const encodedData = encodeBase64Unicode(shareObj);
        window.history.pushState({}, '', `?data=${encodedData}`);

        showResult(name, data.message, data.giftIdea);
        triggerConfetti();

    } catch (error) {
        console.error(error);
        alert("Oops! Something went wrong. Please try again.");
        resetApp();
    }
});

// Display Results
function showResult(name, message, giftIdea) {
    loading.classList.add('hidden');
    resultSection.classList.remove('hidden');
    formSection.classList.add('hidden');

    document.getElementById('res-name').innerText = name;
    document.getElementById('res-msg').innerText = `"${message}"`;
    document.getElementById('res-gift').innerText = giftIdea;
}

// Reset App
function resetApp() {
    window.history.pushState({}, '', window.location.pathname); // Clear URL params
    form.reset();
    resultSection.classList.add('hidden');
    loading.classList.add('hidden');
    formSection.classList.remove('hidden');
}

// Download Card as PNG
function downloadCard() {
    const card = document.getElementById('greeting-card');
    html2canvas(card, { scale: 2, backgroundColor: '#022c22' }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Eid_Card_${document.getElementById('res-name').innerText}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}

// Share to WhatsApp
function shareWhatsApp() {
    const url = window.location.href;
    const text = `I made a custom Eid card and gift idea for you! Check it out here: ${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
}

// Copy Link
function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert("Link copied to clipboard! Send it to your friend.");
    });
}

// Confetti Effect
function triggerConfetti() {
    confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#ffffff', '#064e3b'] // Gold, White, Green
    });
}

// Eidi Fun Mode
function spinEidi() {
    const options = [
        "Nobody, you are broke 😭", 
        "Your rich uncle! 💰", 
        "Your dad, but he'll take it back for 'safekeeping' 👀", 
        "You owe ME Eidi! 🫵", 
        "Your older sibling (miracles happen) ✨"
    ];
    const resultText = document.getElementById('eidi-result');
    resultText.classList.remove('hidden');
    
    let count = 0;
    const interval = setInterval(() => {
        resultText.innerText = options[Math.floor(Math.random() * options.length)];
        count++;
        if (count > 10) {
            clearInterval(interval);
            resultText.innerText = options[Math.floor(Math.random() * options.length)];
            confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
        }
    }, 100);
}
