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

        expManager.addExpense(Number(amount), desp, exp_date, category, payMethod);
        totalAmt.innerText = `₹${expManager.totalAmount().toFixed(2)}`;
        message.innerText = "Expense recorded successfully.";
        message.classList.remove("hidden");

        // cleanup
        amountEl.value = "";
        despEl.value = "";
        dateEl.value = "";
        categoryEl.value = "";
        payMethodEl.value = "";
    });

    resetBtn.addEventListener("click", () => {
        const confirmReset = confirm("Are you sure you want to delete all records?");
        if (!confirmReset) return;

        expManager.deleteAll();
        totalAmt.innerText = `₹0.00`;
        message.innerText = "All records deleted.";
        message.classList.remove("hidden");
});

    // Initial load
    totalAmt.innerText = `₹${expManager.totalAmount().toFixed(2)}`;

}

main();