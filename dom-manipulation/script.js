
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

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    showRandomQuote();
    createAddQuoteForm();
});