const list = document.getElementById("logList");
const noLogsMessage = document.getElementById("noLogsMessage");

document.addEventListener("DOMContentLoaded", () => {
    const data = localStorage.getItem("transactions");

    if (data) {
        const parsed = JSON.parse(data);

        // Hide default message if transactions exist
        if (parsed.length > 0) {
            noLogsMessage.style.display = "none";
        }

        parsed.forEach(item => {
            if (item.status && item.transaction) {
                const { amount, category, date, description } = item.transaction;

                const li = document.createElement("li");
                li.className = "p-4 bg-gray-700 rounded-lg shadow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2";

                li.innerHTML = `
                    <div>
                        <p class="text-lg font-semibold text-blue-300">Amount: <strong>₹${amount}</strong></p>
                        <p class="text-sm text-gray-300">Category: ${category}</p>
                        <p class="text-sm text-gray-400">Description: ${description}</p>
                    </div>
                    <div class="text-sm text-gray-500 sm:text-right">Date: ${date}</div>
                `;

                list.appendChild(li);
            }
        });
    }
});

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
