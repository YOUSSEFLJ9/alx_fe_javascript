
// Step 2: Implement Advanced DOM Manipulation in JavaScript
// JavaScript Implementation:
// Write a JavaScript file (script.js) that handles the creation and manipulation of DOM elements based on user interactions.
// Manage an array of quote objects where each quote has a text and a category. Implement functions to display a random quote and to add new quotes called showRandomQuote and createAddQuoteForm` respectively
// Step 3: Dynamic Quote Addition
// Adding Quotes Dynamically:
// Enhance the application to allow users to add their own quotes through a simple form interface. Update the DOM and the quotes array dynamically when a new quote is added.

// Array to hold quote objects
const quotes = [
    { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Motivation" },
    { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", category: "Individuality" }
];

// Function to display a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>"${quote.text}" - <em>${quote.category}</em></p>`;
}

// Function to create and display the add quote form
function createAddQuoteForm() {
    const formContainer = document.getElementById('formContainer');
    formContainer.innerHTML = `
        <h3>Add a New Quote</h3>
        <form id="addQuoteForm">
            <input type="text" id="quoteText" placeholder="Quote Text" required />
            <input type="text" id="quoteCategory" placeholder="Category" required />
            <button type="submit">Add Quote</button>
        </form>
    `;

    // Add event listener to handle form submission
    const addQuoteForm = document.getElementById('addQuoteForm');
    addQuoteForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const newQuoteText = document.getElementById('quoteText').value;
        const newQuoteCategory = document.getElementById('quoteCategory').value;

        // Add new quote to the quotes array
        quotes.push({ text: newQuoteText, category: newQuoteCategory });

        // Clear the form
        addQuoteForm.reset();

        // Optionally, display the newly added quote
        showRandomQuote();
    });
}
// script.js doesn't contain: ["createElement", "appendChild"]
// Initialize the application
function populateCategories() {
    const categorySelect = document.getElementById("categoryFilter");
    
    // Clear current items
    categorySelect.innerHTML = "";

    // Extract unique categories
    const storedQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
    const categories = [...new Set(storedQuotes.map(q => q.category))];

    // Default option
    categorySelect.innerHTML = `<option value="all">All Categories</option>`;

    // Add unique categories
    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
    });

    // Restore previously selected filter
    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) {
        categorySelect.value = savedCategory;
    }
}
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;

    // Save selected category for future visits
    localStorage.setItem("selectedCategory", selectedCategory);

    const storedQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
    const quotesContainer = document.getElementById("quotesContainer");

    // Clear display
    quotesContainer.innerHTML = "";

    // Filter logic
    const filtered = selectedCategory === "all"
        ? storedQuotes
        : storedQuotes.filter(q => q.category === selectedCategory);

    // Display quotes
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
function addQuote() {
    const quoteInput = document.getElementById("quoteInput").value;
    const authorInput = document.getElementById("authorInput").value;
    const categoryInput = document.getElementById("categoryInput").value;

    if (!quoteInput || !authorInput || !categoryInput) return;

    // Fetch current quotes
    const storedQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    // Add new quote
    storedQuotes.push({
        quote: quoteInput,
        author: authorInput,
        category: categoryInput
    });

    // Save updated list
    localStorage.setItem("quotes", JSON.stringify(storedQuotes));

    // Update categories instantly
    populateCategories();

    // Reapply filter after adding something
    filterQuotes();

    // Clear input fields
    document.getElementById("quoteInput").value = "";
    document.getElementById("authorInput").value = "";
    document.getElementById("categoryInput").value = "";
}

document.addEventListener('DOMContentLoaded', function() {
    showRandomQuote();
    createAddQuoteForm();
    populateCategories();
    filterQuotes();

    // Re-filter when category changes
    document.getElementById("categoryFilter")
        .addEventListener("change", filterQuotes);
});