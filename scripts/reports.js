import { Base } from "../scripts/main.js";

const expManager = new Base();
const reportSection = document.getElementById("reportSection");
const reportContent = document.getElementById("reportContent");

function showMonthlyReport() {
    const now = new Date();
    const report = expManager.getMonthlyReport();
    
    const content = `
        <h3 class="text-xl font-bold text-blue-400 mb-4">Monthly Report - ${report.monthName} ${report.year}</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-gray-700 p-4 rounded-lg text-center">
                <p class="text-2xl font-bold text-green-400">₹${report.totalSpent.toFixed(2)}</p>
                <p class="text-sm text-gray-400">Total Spent</p>
            </div>
            <div class="bg-gray-700 p-4 rounded-lg text-center">
                <p class="text-2xl font-bold text-blue-400">${report.transactionCount}</p>
                <p class="text-sm text-gray-400">Transactions</p>
            </div>
            <div class="bg-gray-700 p-4 rounded-lg text-center">
                <p class="text-2xl font-bold text-purple-400">₹${report.transactionCount > 0 ? (report.totalSpent / report.transactionCount).toFixed(2) : '0.00'}</p>
                <p class="text-sm text-gray-400">Average per Transaction</p>
            </div>
        </div>

        <h4 class="text-lg font-semibold text-gray-200 mb-3">Spending by Category</h4>
        <div class="space-y-2">
            ${Object.entries(report.categoryBreakdown).map(([category, amount]) => `
                <div class="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
                    <span class="capitalize">${category}</span>
                    <span class="font-semibold text-green-400">₹${amount.toFixed(2)}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    reportContent.innerHTML = content;
    reportSection.classList.remove("hidden");
}

function showWeeklyReport() {
    const report = expManager.getWeeklyReport();
    
    const content = `
        <h3 class="text-xl font-bold text-green-400 mb-4">Weekly Report - ${report.startDate} to ${report.endDate}</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-gray-700 p-4 rounded-lg text-center">
                <p class="text-2xl font-bold text-green-400">₹${report.totalSpent.toFixed(2)}</p>
                <p class="text-sm text-gray-400">Total Spent</p>
            </div>
            <div class="bg-gray-700 p-4 rounded-lg text-center">
                <p class="text-2xl font-bold text-blue-400">${report.transactionCount}</p>
                <p class="text-sm text-gray-400">Transactions</p>
            </div>
            <div class="bg-gray-700 p-4 rounded-lg text-center">
                <p class="text-2xl font-bold text-purple-400">₹${report.transactionCount > 0 ? (report.totalSpent / report.transactionCount).toFixed(2) : '0.00'}</p>
                <p class="text-sm text-gray-400">Average per Transaction</p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h4 class="text-lg font-semibold text-gray-200 mb-3">Daily Breakdown</h4>
                <div class="space-y-2">
                    ${Object.entries(report.dailyBreakdown).map(([date, amount]) => `
                        <div class="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
                            <span>${new Date(date).toLocaleDateString()}</span>
                            <span class="font-semibold text-green-400">₹${amount.toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div>
                <h4 class="text-lg font-semibold text-gray-200 mb-3">Category Breakdown</h4>
                <div class="space-y-2">
                    ${Object.entries(report.categoryBreakdown).map(([category, amount]) => `
                        <div class="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
                            <span class="capitalize">${category}</span>
                            <span class="font-semibold text-green-400">₹${amount.toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    reportContent.innerHTML = content;
    reportSection.classList.remove("hidden");
}

function showTrendsReport() {
    const trends = expManager.getSpendingTrends();
    
    const content = `
        <h3 class="text-xl font-bold text-purple-400 mb-4">Spending Trends (Last 6 Months)</h3>
        
        <div class="space-y-3">
            ${trends.map(trend => `
                <div class="flex justify-between items-center bg-gray-700 p-4 rounded-lg">
                    <div>
                        <span class="font-semibold text-gray-200">${trend.period}</span>
                        <span class="text-sm text-gray-400 ml-2">(${trend.transactionCount} transactions)</span>
                    </div>
                    <span class="text-xl font-bold text-green-400">₹${trend.totalSpent.toFixed(2)}</span>
                </div>
            `).join('')}
        </div>
        
        <div class="mt-6 p-4 bg-gray-700 rounded-lg">
            <h4 class="text-lg font-semibold text-gray-200 mb-2">Summary</h4>
            <div class="grid grid-cols-2 gap-4 text-center">
                <div>
                    <p class="text-2xl font-bold text-blue-400">${trends.reduce((sum, t) => sum + t.transactionCount, 0)}</p>
                    <p class="text-sm text-gray-400">Total Transactions</p>
                </div>
                <div>
                    <p class="text-2xl font-bold text-green-400">₹${trends.reduce((sum, t) => sum + t.totalSpent, 0).toFixed(2)}</p>
                    <p class="text-sm text-gray-400">Total Spent</p>
                </div>
            </div>
        </div>
    `;
    
    reportContent.innerHTML = content;
    reportSection.classList.remove("hidden");
}

// Make functions globally available
window.showMonthlyReport = showMonthlyReport;
window.showWeeklyReport = showWeeklyReport;
window.showTrendsReport = showTrendsReport;