//----------------------------------------------------
// INITIAL LOCAL DATA SETUP
//----------------------------------------------------
if (!localStorage.getItem("quotes")) {
    localStorage.setItem("quotes", JSON.stringify([
        { id: 1, quote: "Be yourself.", author: "Unknown", category: "Inspiration" }
    ]));
}

let lastConflicts = [];
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

//----------------------------------------------------
// POPULATE CATEGORIES
//----------------------------------------------------
function populateCategories() {
    const categorySelect = document.getElementById("categoryFilter");
    const storedQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    const categories = [...new Set(storedQuotes.map(q => q.category))];

    categorySelect.innerHTML = `<option value="all">All Categories</option>`;

    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
    });

    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) categorySelect.value = savedCategory;
}

//----------------------------------------------------
// FILTER QUOTES
//----------------------------------------------------
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("selectedCategory", selectedCategory);

    const storedQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
    const quotesContainer = document.getElementById("quotesContainer");
    quotesContainer.innerHTML = "";

    const filtered = selectedCategory === "all"
        ? storedQuotes
        : storedQuotes.filter(q => q.category === selectedCategory);

    filtered.forEach(q => {
        const div = document.createElement("div");
        div.className = "quote-item";
        div.innerHTML = `
            <p><strong>${q.quote}</strong></p>
            <p>- ${q.author} (${q.category})</p>
        `;
        quotesContainer.appendChild(div);
    });
}

//----------------------------------------------------
// ADD NEW QUOTE
//----------------------------------------------------
function addQuote() {
    const quoteInput = document.getElementById("quoteInput").value;
    const authorInput = document.getElementById("authorInput").value;
    const categoryInput = document.getElementById("categoryInput").value;

    if (!quoteInput || !authorInput || !categoryInput)
        return alert("Please fill all fields.");

    const storedQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    storedQuotes.push({
        id: Date.now(),
        quote: quoteInput,
        author: authorInput,
        category: categoryInput
    });

    localStorage.setItem("quotes", JSON.stringify(storedQuotes));

    populateCategories();
    filterQuotes();

    document.getElementById("quoteInput").value = "";
    document.getElementById("authorInput").value = "";
    document.getElementById("categoryInput").value = "";
}

//----------------------------------------------------
// SERVER: FETCH SIMULATED QUOTES
//----------------------------------------------------
async function fetchServerQuotes() {
    const res = await fetch(SERVER_URL);
    const data = await res.json();

    return data.slice(0, 5).map(item => ({
        id: item.id,
        quote: item.title,
        author: "Server",
        category: "Remote"
    }));
}

//----------------------------------------------------
// SYNC WITH SERVER (SERVER ALWAYS WINS)
//----------------------------------------------------
async function syncWithServer() {
    console.log("Syncing with server...");

    const serverQuotes = await fetchQuotesFromServer();
    const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    const newLocalQuotes = [];
    lastConflicts = [];

    serverQuotes.forEach(sq => {
        const match = localQuotes.find(lq => lq.id === sq.id);
        if (match && JSON.stringify(match) !== JSON.stringify(sq)) {
            lastConflicts.push({ local: match, server: sq });
        }
        newLocalQuotes.push(sq);
    });

    localQuotes.forEach(lq => {
        if (!serverQuotes.some(sq => sq.id === lq.id)) {
            newLocalQuotes.push(lq);
        }
    });

    localStorage.setItem("quotes", JSON.stringify(newLocalQuotes));

    populateCategories();
    filterQuotes();

    if (lastConflicts.length > 0) {
        notify("Server updates detected. Conflicts resolved using server data.");
    }
}

//----------------------------------------------------
// NOTIFICATION SYSTEM
//----------------------------------------------------
function notify(message) {
    const box = document.getElementById("notification");
    box.textContent = message;
    box.style.display = "block";
    setTimeout(() => {
        box.style.display = "none";
    }, 6000);
}

//----------------------------------------------------
// MANUAL CONFLICT REVIEW
//----------------------------------------------------
function manualSyncReview() {
    const section = document.getElementById("manualConflictSection");
    section.innerHTML = "";

    if (lastConflicts.length === 0) {
        section.innerHTML = "<p>No conflicts from last sync.</p>";
        return;
    }

    lastConflicts.forEach(conf => {
        const div = document.createElement("div");
        div.className = "conflict-box";
        div.innerHTML = `
            <p><strong>Conflict Detected:</strong></p>
            <p>Local: "${conf.local.quote}"</p>
            <p>Server: "${conf.server.quote}"</p>
            <p><em>Server version selected</em></p>
        `;
        section.appendChild(div);
    });
}

//----------------------------------------------------
// INITIALIZE APP ON PAGE LOAD
//----------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    populateCategories();
    filterQuotes();
    syncWithServer();

    document.getElementById("categoryFilter")
        .addEventListener("change", filterQuotes);
});

// Sync every 20 seconds
setInterval(syncWithServer, 20000);
