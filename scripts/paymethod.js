const list = document.getElementById("methodSummary");
const noMsg = document.getElementById("noDataMsg");

document.addEventListener("DOMContentLoaded", () => {
    const data = localStorage.getItem("paymentmethods"); // ensure key matches exactly

    if (data) {
        const parsed = JSON.parse(data);

        // Filter only UPI and Cash entries
        const filtered = parsed.filter(item => item.type === "upi" || item.type === "cash");

        if (filtered.length > 0) {
            noMsg.style.display = "none";
        }

        filtered.forEach(({ type, details, amount }) => {
            const li = document.createElement("li");

            li.className = "p-8 bg-gray-700 rounded-lg shadow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2";

            li.innerHTML = `
                <div>
                    <p class="text-lg font-semibold text-blue-300">Method: <strong>${type}</strong></p>
                    <p class="text-sm text-gray-300">Amount: ₹${amount}</p>
                </div>
            `;

            list.appendChild(li);
        });
    }
});
