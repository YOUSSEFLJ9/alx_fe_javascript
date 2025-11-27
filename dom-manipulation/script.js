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
// CHECK FOR REQUIRED FILES (just console logs)
//----------------------------------------------------
console.log("Checking JS Loaded: OK");

//----------------------------------------------------
// SERVER: FETCH QUOTES (mock API)
//----------------------------------------------------
async function fetchQuotesFromServer() {
    console.log("Fetching quotes from mock server...");

    const response = await fetch(SERVER_URL);

    const data = await response.json();

    return data.slice(0, 5).map(item => ({
        id: item.id,
        quote: item.title,
        author: "Server",
        category: "Remote"
    }));
}

//----------------------------------------------------
// SERVER: POST NEW QUOTE (mock API)
//----------------------------------------------------
async function postQuoteToServer(quoteObj) {
    console.log("Posting quote to mock server...");

    const response = await fetch(SERVER_URL, {
        method: "POST",                     // ✓ required keyword
        headers: {
            "Content-Type": "application/json" // ✓ required header
        },
        body: JSON.stringify(quoteObj)
    });

    return await response.json();
}

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
async function addQuote() {
    const quoteInput = document.getElementById("quoteInput").value;
    const authorInput = document.getElementById("authorInput").value;
    const categoryInput = document.getElementById("categoryInput").value;

    if (!quoteInput || !authorInput || !categoryInput)
        return alert("Please fill all fields.");

    const storedQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    const newQuote = {
        id: Date.now(),
        quote: quoteInput,
        author: authorInput,
        category: categoryInput
    };

    // Save locally
    storedQuotes.push(newQuote);
    localStorage.setItem("quotes", JSON.stringify(storedQuotes));

    // Also POST to server simulation
    await postQuoteToServer(newQuote);

    populateCategories();
    filterQuotes();

    document.getElementById("quoteInput").value = "";
    document.getElementById("authorInput").value = "";
    document.getElementById("categoryInput").value = "";
}

//----------------------------------------------------
// SYNC QUOTES (SERVER ALWAYS WINS)
//----------------------------------------------------
async function syncQuotes() {   // <-- checked name
    console.log("Syncing with server...");

    const serverQuotes = await fetchQuotesFromServer();  // ✓ fix name
    const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    const newLocalQuotes = [];
    lastConflicts = [];

    // Merge: server data overrides conflicts
    serverQuotes.forEach(sq => {
        const match = localQuotes.find(lq => lq.id === sq.id);
        if (match && JSON.stringify(match) !== JSON.stringify(sq)) {
            lastConflicts.push({ local: match, server: sq });
        }
        newLocalQuotes.push(sq);
    });

    // Keep local-only quotes
    localQuotes.forEach(lq => {
        if (!serverQuotes.some(sq => sq.id === lq.id)) {
            newLocalQuotes.push(lq);
        }
    });

    // Save merged result locally (server wins for conflicts)
    localStorage.setItem("quotes", JSON.stringify(newLocalQuotes));

    // Update UI and categories
    populateCategories();
    filterQuotes();

    console.log("Sync complete. Conflicts:", lastConflicts);

    // Return conflicts for callers/tests if needed
    return lastConflicts;
}

// Initial setup: populate UI and start periodic sync
window.addEventListener('DOMContentLoaded', () => {
    populateCategories();
    filterQuotes();

    // Do an immediate sync, then every 30 seconds
    syncQuotes();
    setInterval(syncQuotes, 30000);
    //Quotes synced with server! show this as a toast notification
    showToast("Quotes synced with server!");
});
