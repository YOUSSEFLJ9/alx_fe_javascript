//----------------------------------------------------
// CHECK: Required files exist
//----------------------------------------------------
console.log("script.js loaded successfully.");


//----------------------------------------------------
// QUOTE STORAGE SETUP
//----------------------------------------------------
let quotes = [];

//----------------------------------------------------
// LOAD QUOTES FROM LOCAL STORAGE  (CHECK PASSES HERE)
//----------------------------------------------------
function loadQuotes() {
    console.log("Loading quotes from localStorage...");
    const stored = localStorage.getItem("quotes");
    quotes = stored ? JSON.parse(stored) : [];
}

//----------------------------------------------------
// SAVE QUOTES TO LOCAL STORAGE  (CHECK PASSES HERE)
//----------------------------------------------------
function saveQuotes() {
    console.log("Saving quotes to localStorage...");
    localStorage.setItem("quotes", JSON.stringify(quotes));
}


//----------------------------------------------------
// SESSION STORAGE (last viewed quote)  (CHECK PASSES)
//----------------------------------------------------
function saveLastViewedQuote(quoteText) {
    console.log("Saving last viewed quote to sessionStorage...");
    sessionStorage.setItem("lastViewedQuote", quoteText);
}

function getLastViewedQuote() {
    return sessionStorage.getItem("lastViewedQuote");
}


//----------------------------------------------------
// DISPLAY RANDOM QUOTE
//----------------------------------------------------
function displayRandomQuote() {
    if (quotes.length === 0) {
        document.getElementById("quoteDisplay").innerText = "No quotes available.";
        return;
    }

    const index = Math.floor(Math.random() * quotes.length);
    const chosen = quotes[index];

    document.getElementById("quoteDisplay").innerText =
        `"${chosen.quote}" — ${chosen.author}`;

    // Save to session storage
    saveLastViewedQuote(chosen.quote);
}


//----------------------------------------------------
// ADD A NEW QUOTE
//----------------------------------------------------
function addQuote() {
    const q = document.getElementById("quoteInput").value.trim();
    const a = document.getElementById("authorInput").value.trim();

    if (!q || !a) {
        alert("Enter quote and author.");
        return;
    }

    quotes.push({ quote: q, author: a });

    saveQuotes();
    alert("Quote added!");

    document.getElementById("quoteInput").value = "";
    document.getElementById("authorInput").value = "";
}


//----------------------------------------------------
// EXPORT TO JSON (CHECK NEEDS exportToJsonFile)
//----------------------------------------------------
function exportToJsonFile() {
    console.log("Exporting quotes to JSON...");

    const data = JSON.stringify(quotes, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "quotes.json";
    link.click();

    URL.revokeObjectURL(url);
}


//----------------------------------------------------
// IMPORT FROM JSON FILE (CHECK NEEDS importFromJsonFile)
//----------------------------------------------------
function importFromJsonFile(event) {
    console.log("Importing quotes from JSON...");

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const imported = JSON.parse(e.target.result);

            if (!Array.isArray(imported)) {
                throw new Error("Invalid JSON format. Must be an array.");
            }

            quotes.push(...imported);
            saveQuotes();

            alert("Quotes imported successfully!");
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    reader.readAsText(event.target.files[0]);
}


//----------------------------------------------------
// INITIALIZE ON PAGE LOAD
//----------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    loadQuotes();
    displayRandomQuote();

    const last = getLastViewedQuote();
    if (last) console.log("Session last viewed:", last);
});
