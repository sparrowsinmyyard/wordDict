document.addEventListener("DOMContentLoaded", () => {
let practiceDeck = [];
let currentIndex = 0;
    const overlay = document.createElement("div");
    overlay.className = "practice-overlay";

    overlay.innerHTML = `
        <div class="practice-modal">

            <div class="practice-header">
                <div class="practice-title">Practice Mode</div>
                <button class="practice-close">✕</button>
            </div>

            <div class="practice-card">
                <div class="practice-word">дом</div>
                <div class="practice-arrow">→</div>
                <div class="practice-translation">house</div>
            </div>

            <div class="practice-controls">
                <button class="secondary">← Previous</button>
                <button class="secondary">Next →</button>
            </div>

        </div>
    `;

    document.body.appendChild(overlay);

    const closeBtn = overlay.querySelector(".practice-close");

const wordEl = overlay.querySelector(".practice-word");
const translationEl = overlay.querySelector(".practice-translation");

const prevBtn = overlay.querySelector(".practice-controls button:first-child");
const nextBtn = overlay.querySelector(".practice-controls button:last-child");

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showCurrentCard() {

    if (!practiceDeck.length) {
        wordEl.textContent = "Nothing yet";
        translationEl.textContent = "Add a few words first :)";
        return;
    }

    const card = practiceDeck[currentIndex];

    wordEl.textContent = card.ru;
    translationEl.textContent = card.en;
}

async function recordRevision() {

    if (!practiceDeck.length) return;

    const card = practiceDeck[currentIndex];

    const key = card.ru.trim().toLowerCase().replace(/\//g, "_");

    card.count = (card.count || 1) + 1;

    card.lastDate = new Date().toISOString().slice(0, 10);

    window.entries[key] = card;

    await window.saveEntry(key, card);
}

    closeBtn.addEventListener("click", () => {
        overlay.classList.remove("show");
    });

    overlay.addEventListener("click", e => {
        if(e.target === overlay){
            overlay.classList.remove("show");
        }
    });

    window.openPractice = function(){

 

practiceDeck = Object.values(window.entries || {});

if (!practiceDeck.length) {
    showCurrentCard();
    overlay.classList.add("show");
    return;
}

    shuffle(practiceDeck);

    currentIndex = 0;

    showCurrentCard();

    overlay.classList.add("show");
};

nextBtn.addEventListener("click", async () => {

    if(!practiceDeck.length) return;
    await recordRevision();
    currentIndex++;

    if(currentIndex >= practiceDeck.length){

        shuffle(practiceDeck);

        currentIndex = 0;
    }

    showCurrentCard();

});

prevBtn.addEventListener("click", () => {

    if(!practiceDeck.length) return;

    currentIndex--;

    if(currentIndex < 0){

        currentIndex = practiceDeck.length - 1;
    }

    showCurrentCard();

});

});
