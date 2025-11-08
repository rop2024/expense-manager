import { Base } from "./main.js";

// Support Function
function categoryMsg(boolean) {
    return boolean === false ? "Budget limit crossed!" : "";
}

// Program Entry
const expManager = new Base();

function main() {
    const AddButton = document.getElementById("addExpenseButton");
    const totalAmt = document.getElementById("outputAmount");
    const message = document.getElementById("messageDisplay");
    const resetBtn = document.getElementById("resetBtn");
    const budgetAlerts = document.getElementById("budgetAlerts");
    const alertsList = document.getElementById("alertsList");

    AddButton.addEventListener("click", () => {
        const amountEl = document.getElementById("expenseInput");
        const despEl = document.getElementById("descriptionInput");
        const dateEl = document.getElementById("dateInput");
        const categoryEl = document.getElementById("categoryInput");
        const payMethodEl = document.getElementById("paymentMethodInput");

        const amount = amountEl.value;
        const desp = despEl.value;
        const exp_date = dateEl.value;
        const category = categoryEl.value;
        const payMethod = payMethodEl.value;

        // Validation
        if (!amount || !desp || !exp_date || !category || !payMethod) {
            message.innerText = "One or more fields are empty.";
            message.classList.remove("hidden");
            return;
        }

        if (isNaN(Number(amount))) {
            message.innerText = "Amount must be a valid number.";
            message.classList.remove("hidden");
            return;
        }

        const selectedDate = new Date(exp_date);
        const today = new Date();
        selectedDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            message.innerText = "Date must be today or earlier.";
            message.classList.remove("hidden");
            return;
        }

        const success = expManager.addExpense(Number(amount), desp, exp_date, category, payMethod);
        
        if (success) {
            totalAmt.innerText = `₹${expManager.totalAmount().toFixed(2)}`;
            message.innerText = "Expense recorded successfully.";
            message.classList.remove("hidden");
            updateBudgetAlerts(); // Update budget alerts after adding expense

            // cleanup
            amountEl.value = "";
            despEl.value = "";
            dateEl.value = "";
            categoryEl.value = "";
            payMethodEl.value = "";
        } else {
            message.innerText = "Failed to save expense. Please try again.";
            message.classList.remove("hidden");
        }
    });

    resetBtn.addEventListener("click", () => {
        const confirmReset = confirm("Are you sure you want to delete all records?");
        if (!confirmReset) return;

        const success = expManager.deleteAll();
        if (success) {
            totalAmt.innerText = `₹0.00`;
            message.innerText = "All records deleted.";
            message.classList.remove("hidden");
        } else {
            message.innerText = "Failed to delete all records. Please try again.";
            message.classList.remove("hidden");
        }
    });

    // Initial load
    totalAmt.innerText = `₹${expManager.totalAmount().toFixed(2)}`;
    updateBudgetAlerts();

}

function updateBudgetAlerts() {
    const alerts = expManager.getBudgetAlerts();
    
    if (alerts.length === 0) {
        budgetAlerts.classList.add("hidden");
        return;
    }
    
    budgetAlerts.classList.remove("hidden");
    alertsList.innerHTML = "";
    
    alerts.forEach(alert => {
        const alertDiv = document.createElement("div");
        alertDiv.className = `p-3 rounded-lg text-sm ${
            alert.status === 'exceeded' 
                ? 'bg-red-900 border border-red-700 text-red-200' 
                : 'bg-yellow-900 border border-yellow-700 text-yellow-200'
        }`;
        
        alertDiv.innerHTML = `
            <strong>${alert.category.charAt(0).toUpperCase() + alert.category.slice(1)}</strong>: 
            ₹${alert.spent} / ₹${alert.limit} (${alert.percentage}%)
            ${alert.status === 'exceeded' ? ' - Budget Exceeded!' : ' - Budget Reached'}
        `;
        
        alertsList.appendChild(alertDiv);
    });
}

main();