const categoryList = document.getElementById("categoryList");
const noCategoriesMessage = document.getElementById("noCategoriesMessage");

document.addEventListener("DOMContentLoaded", () => {
    const data = localStorage.getItem("categories");

    if (!data) return;

    const categories = JSON.parse(data);

    if (categories.length === 0) return;

    noCategoriesMessage.style.display = "none";

    categories.forEach(cat => {
        const li = document.createElement("li");
        li.className =
            "bg-gray-700 rounded-lg shadow-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between";

        li.innerHTML = `
            <div>
                <p class="text-blue-300 font-semibold text-lg capitalize">${cat.name}</p>
                <p class="text-sm text-gray-400">Spent: ₹${cat.amount} / ₹${cat.budgetLimit}</p>
            </div>
        `;

        categoryList.appendChild(li);
    });
});
