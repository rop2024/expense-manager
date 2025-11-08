import { Base } from "./main.js";

const list = document.getElementById("logList");
const noLogsMessage = document.getElementById("noLogsMessage");
const expManager = new Base();

// Search and filter elements
const searchDescription = document.getElementById("searchDescription");
const filterCategory = document.getElementById("filterCategory");
const filterDateFrom = document.getElementById("filterDateFrom");
const filterDateTo = document.getElementById("filterDateTo");
const filterAmountMin = document.getElementById("filterAmountMin");
const filterAmountMax = document.getElementById("filterAmountMax");

document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
    loadTransactions();
    
    // Add event listeners for search and filter
    searchDescription.addEventListener("input", filterTransactions);
    filterCategory.addEventListener("change", filterTransactions);
    filterDateFrom.addEventListener("change", filterTransactions);
    filterDateTo.addEventListener("change", filterTransactions);
    filterAmountMin.addEventListener("input", filterTransactions);
    filterAmountMax.addEventListener("input", filterTransactions);
});

function loadCategories() {
    const categories = expManager.categories;
    filterCategory.innerHTML = '<option value="">All Categories</option>';
    
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.name;
        option.textContent = category.name.charAt(0).toUpperCase() + category.name.slice(1);
        filterCategory.appendChild(option);
    });
}

function loadTransactions(filteredTransactions = null) {
    // Clear existing list
    list.innerHTML = '';
    
    const transactions = filteredTransactions || expManager.transactionsLog();
    
    if (transactions.length === 0) {
        noLogsMessage.style.display = "block";
        return;
    }

    noLogsMessage.style.display = "none";

    transactions.forEach((transaction, originalIndex) => {
        if (transaction.status && transaction.transaction) {
            const { amount, category, date, description } = transaction.transaction;

            const li = document.createElement("li");
            li.className = "p-4 bg-gray-700 rounded-lg shadow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2";
            li.dataset.index = originalIndex;

            li.innerHTML = `
                <div class="flex-1">
                    <p class="text-lg font-semibold text-blue-300">Amount: <strong>₹${amount}</strong></p>
                    <p class="text-sm text-gray-300">Category: ${category}</p>
                    <p class="text-sm text-gray-400">Description: ${description}</p>
                </div>
                <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <div class="text-sm text-gray-500 sm:text-right">Date: ${date}</div>
                    <div class="flex gap-2">
                        <button onclick="editTransaction(${originalIndex})" 
                                class="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded transition duration-200">
                            Edit
                        </button>
                        <button onclick="deleteTransaction(${originalIndex})" 
                                class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition duration-200">
                            Delete
                        </button>
                    </div>
                </div>
            `;

            list.appendChild(li);
        }
    });
}

function filterTransactions() {
    const searchTerm = searchDescription.value.toLowerCase();
    const categoryFilter = filterCategory.value;
    const dateFrom = filterDateFrom.value;
    const dateTo = filterDateTo.value;
    const amountMin = parseFloat(filterAmountMin.value) || 0;
    const amountMax = parseFloat(filterAmountMax.value) || Infinity;
    
    const allTransactions = expManager.transactionsLog();
    
    const filteredTransactions = allTransactions.filter((transaction, index) => {
        if (!transaction.status || !transaction.transaction) return false;
        
        const { amount, category, date, description } = transaction.transaction;
        
        // Search description
        if (searchTerm && !description.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // Filter by category
        if (categoryFilter && category !== categoryFilter) {
            return false;
        }
        
        // Filter by date range
        if (dateFrom && date < dateFrom) {
            return false;
        }
        if (dateTo && date > dateTo) {
            return false;
        }
        
        // Filter by amount range
        if (amount < amountMin || amount > amountMax) {
            return false;
        }
        
        return true;
    });
    
    loadTransactions(filteredTransactions);
}

function clearFilters() {
    searchDescription.value = '';
    filterCategory.value = '';
    filterDateFrom.value = '';
    filterDateTo.value = '';
    filterAmountMin.value = '';
    filterAmountMax.value = '';
    
    loadTransactions();
}

function editTransaction(index) {
    const transaction = expManager.transactionsLog()[index];
    if (!transaction || !transaction.status) return;

    const expense = transaction.transaction;
    
    // Create edit form
    const newAmount = prompt("Enter new amount:", expense.amount);
    if (newAmount === null) return; // Cancelled
    
    const newDescription = prompt("Enter new description:", expense.description);
    if (newDescription === null) return; // Cancelled
    
    const newDate = prompt("Enter new date (YYYY-MM-DD):", expense.date);
    if (newDate === null) return; // Cancelled
    
    const newCategory = prompt("Enter new category:", expense.category);
    if (newCategory === null) return; // Cancelled
    
    const newPaymentMethod = prompt("Enter new payment method:", "cash"); // Default to cash
    if (newPaymentMethod === null) return; // Cancelled

    // Validate inputs
    if (!newAmount || isNaN(Number(newAmount)) || !newDescription || !newDate || !newCategory || !newPaymentMethod) {
        alert("Invalid input. Please try again.");
        return;
    }

    const success = expManager.editTransaction(index, Number(newAmount), newDescription, newDate, newCategory, newPaymentMethod);
    
    if (success) {
        alert("Transaction updated successfully!");
        loadTransactions(); // Refresh the list
    } else {
        alert("Failed to update transaction. Please try again.");
    }
}

function deleteTransaction(index) {
    const confirmDelete = confirm("Are you sure you want to delete this transaction?");
    if (!confirmDelete) return;

    const success = expManager.deleteTransaction(index);
    
    if (success) {
        alert("Transaction deleted successfully!");
        loadTransactions(); // Refresh the list
    } else {
        alert("Failed to delete transaction. Please try again.");
    }
}

function downloadData() {
    const data = localStorage.getItem("transactions");
    if (!data) return alert("No data to download.");

    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.json";
    a.click();

    URL.revokeObjectURL(url); // Clean up
}

function downloadCSV() {
    const transactions = expManager.transactionsLog();
    if (transactions.length === 0) return alert("No data to download.");

    // CSV Header
    const headers = ["Date", "Amount", "Description", "Category"];
    let csvContent = headers.join(",") + "\n";

    // CSV Data
    transactions.forEach(transaction => {
        if (transaction.status && transaction.transaction) {
            const { date, amount, description, category } = transaction.transaction;
            
            // Escape commas and quotes in description
            const escapedDescription = description.replace(/"/g, '""');
            const quotedDescription = `"${escapedDescription}"`;
            
            const row = [
                date,
                amount,
                quotedDescription,
                category
            ];
            
            csvContent += row.join(",") + "\n";
        }
    });

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();

    URL.revokeObjectURL(url); // Clean up
}
