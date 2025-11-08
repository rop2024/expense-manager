import { Expense, Category, PaymentMethod, Transaction } from "./classes.js";

export class Base {
    constructor() {
        this.expenses = [];
        this.categories = [];
        this.paymentmethods = [];
        this.transactions = [];
        this.errors = [];

        // Load saved data first, then merge with defaults
        this.loadAll();
        this.mergeDefaults();
    }

    addExpense(exp, desp, date, category, pay_method) {
        const categoryLower = category.toLowerCase();
        const payLower = pay_method.toLowerCase();

        // Check for budget alert before adding
        const budgetAlert = this.checkBudgetOnAdd(categoryLower, exp);
        if (budgetAlert) {
            const proceed = confirm(
                `Warning: Adding this expense will ${budgetAlert.status === 'will-exceed' ? 'exceed' : 'reach'} your budget limit for ${budgetAlert.category}.\n\n` +
                `Current: ₹${budgetAlert.currentSpent}\n` +
                `After adding: ₹${budgetAlert.newTotal}\n` +
                `Limit: ₹${budgetAlert.limit}\n\n` +
                `Do you want to proceed?`
            );
            if (!proceed) {
                return false; // User cancelled
            }
        }

        const inp = new Expense(exp, desp.toLowerCase(), date, categoryLower);
        const trans = new Transaction(inp, true);
        this.transactions.push(trans);

        // Category
        let categoryFound = false;
        for (const cat of this.categories) {
            if (cat.name === categoryLower) {
                cat.appendAmount(exp);
                categoryFound = true;
                break;
            }
        }
        if (!categoryFound) {
            this.addCategory(categoryLower, 100);
            this.categories[this.categories.length - 1].appendAmount(exp);
        }

        // Payment method
        let payFound = false;
        for (const method of this.paymentmethods) {
            if (method.type === payLower) {
                method.appendAmount(exp);
                payFound = true;
                break;
            }
        }
        if (!payFound) {
            const newPay = new PaymentMethod(payLower, payLower);
            newPay.appendAmount(exp);
            this.paymentmethods.push(newPay);
        }

        this.expenses.push(inp);
        const saveSuccess = this.saveAll();
        if (saveSuccess) {
            console.log("Expense added successfully!");
            return true;
        } else {
            console.error("Failed to save expense to storage");
            return false;
        }
    }

    getErrors() {
        return this.errors;
    }

    clearErrors() {
        this.errors = [];
    }

    // Transaction management methods
    editTransaction(index, newAmount, newDescription, newDate, newCategory, newPaymentMethod) {
        if (index < 0 || index >= this.transactions.length) {
            console.error("Invalid transaction index");
            return false;
        }

        const transaction = this.transactions[index];
        if (!transaction || !transaction.status) {
            console.error("Transaction not found or invalid");
            return false;
        }

        const oldExpense = transaction.transaction;
        const oldAmount = oldExpense.amount;
        const oldCategory = oldExpense.category;
        const oldPaymentMethod = this.findPaymentMethodByExpense(oldExpense);

        // Update the expense
        oldExpense.amount = newAmount;
        oldExpense.description = newDescription.toLowerCase();
        oldExpense.date = newDate;
        oldExpense.category = newCategory.toLowerCase();

        // Update category totals
        this.updateCategoryAmount(oldCategory, oldAmount, newCategory, newAmount);

        // Update payment method totals
        this.updatePaymentMethodAmount(oldPaymentMethod, oldAmount, newPaymentMethod, newAmount);

        const saveSuccess = this.saveAll();
        if (saveSuccess) {
            console.log("Transaction updated successfully!");
            return true;
        } else {
            console.error("Failed to save transaction update");
            return false;
        }
    }

    deleteTransaction(index) {
        if (index < 0 || index >= this.transactions.length) {
            console.error("Invalid transaction index");
            return false;
        }

        const transaction = this.transactions[index];
        if (!transaction || !transaction.status) {
            console.error("Transaction not found or invalid");
            return false;
        }

        const expense = transaction.transaction;
        const amount = expense.amount;
        const category = expense.category;
        const paymentMethod = this.findPaymentMethodByExpense(expense);

        // Remove from arrays
        this.expenses = this.expenses.filter(exp => exp !== expense);
        this.transactions.splice(index, 1);

        // Update category totals
        this.adjustCategoryAmount(category, -amount);

        // Update payment method totals
        this.adjustPaymentMethodAmount(paymentMethod, -amount);

        const saveSuccess = this.saveAll();
        if (saveSuccess) {
            console.log("Transaction deleted successfully!");
            return true;
        } else {
            console.error("Failed to save transaction deletion");
            return false;
        }
    }

    // Helper methods for transaction management
    findPaymentMethodByExpense(expense) {
        // This is a simplified approach - in a real app, we'd store payment method in expense
        // For now, we'll find the payment method that has this expense amount
        // This is not perfect but works for the current data structure
        return this.paymentmethods.find(method => 
            method.amount >= expense.amount
        );
    }

    updateCategoryAmount(oldCategory, oldAmount, newCategory, newAmount) {
        // Remove old amount from old category
        this.adjustCategoryAmount(oldCategory, -oldAmount);
        
        // Add new amount to new category
        this.adjustCategoryAmount(newCategory, newAmount);
    }

    adjustCategoryAmount(categoryName, amountDelta) {
        const category = this.categories.find(cat => cat.name === categoryName);
        if (category) {
            category.amount += amountDelta;
        } else {
            // Create new category if it doesn't exist
            this.addCategory(categoryName, 100);
            this.categories[this.categories.length - 1].amount += amountDelta;
        }
    }

    updatePaymentMethodAmount(oldMethod, oldAmount, newMethod, newAmount) {
        // Remove old amount from old method
        if (oldMethod) {
            oldMethod.amount -= oldAmount;
        }
        
        // Add new amount to new method
        this.adjustPaymentMethodAmount(newMethod, newAmount);
    }

    adjustPaymentMethodAmount(methodName, amountDelta) {
        const method = this.paymentmethods.find(m => m.type === methodName);
        if (method) {
            method.amount += amountDelta;
        } else {
            // Create new payment method if it doesn't exist
            const newMethod = new PaymentMethod(methodName, methodName);
            newMethod.amount += amountDelta;
            this.paymentmethods.push(newMethod);
        }
    }

    // Budget alert methods
    getBudgetAlerts() {
        const alerts = [];
        this.categories.forEach(category => {
            if (category.amount >= category.budgetLimit) {
                alerts.push({
                    category: category.name,
                    spent: category.amount,
                    limit: category.budgetLimit,
                    percentage: ((category.amount / category.budgetLimit) * 100).toFixed(1),
                    status: category.amount > category.budgetLimit ? 'exceeded' : 'reached'
                });
            }
        });
        return alerts;
    }

    checkBudgetOnAdd(categoryName, amount) {
        const category = this.categories.find(cat => cat.name === categoryName);
        if (!category) return null;

        const newTotal = category.amount + amount;
        if (newTotal >= category.budgetLimit) {
            return {
                category: category.name,
                currentSpent: category.amount,
                newTotal: newTotal,
                limit: category.budgetLimit,
                percentage: ((newTotal / category.budgetLimit) * 100).toFixed(1),
                status: newTotal > category.budgetLimit ? 'will-exceed' : 'will-reach'
            };
        }
        return null;
    }

    // Reporting methods
    getMonthlyReport(year = null, month = null) {
        const now = new Date();
        const targetYear = year || now.getFullYear();
        const targetMonth = month !== null ? month : now.getMonth();
        
        const monthlyTransactions = this.transactions.filter(transaction => {
            if (!transaction.status || !transaction.transaction) return false;
            
            const transactionDate = new Date(transaction.transaction.date);
            return transactionDate.getFullYear() === targetYear && 
                   transactionDate.getMonth() === targetMonth;
        });

        const totalSpent = monthlyTransactions.reduce((sum, transaction) => 
            sum + transaction.transaction.amount, 0);

        const categoryBreakdown = {};
        monthlyTransactions.forEach(transaction => {
            const category = transaction.transaction.category;
            categoryBreakdown[category] = (categoryBreakdown[category] || 0) + transaction.transaction.amount;
        });

        return {
            year: targetYear,
            month: targetMonth,
            monthName: new Date(targetYear, targetMonth).toLocaleString('default', { month: 'long' }),
            totalSpent,
            transactionCount: monthlyTransactions.length,
            categoryBreakdown,
            transactions: monthlyTransactions
        };
    }

    getWeeklyReport(date = null) {
        const targetDate = date ? new Date(date) : new Date();
        
        // Get start of week (Sunday)
        const startOfWeek = new Date(targetDate);
        startOfWeek.setDate(targetDate.getDate() - targetDate.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        
        // Get end of week (Saturday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const weeklyTransactions = this.transactions.filter(transaction => {
            if (!transaction.status || !transaction.transaction) return false;
            
            const transactionDate = new Date(transaction.transaction.date);
            return transactionDate >= startOfWeek && transactionDate <= endOfWeek;
        });

        const totalSpent = weeklyTransactions.reduce((sum, transaction) => 
            sum + transaction.transaction.amount, 0);

        const categoryBreakdown = {};
        const dailyBreakdown = {};
        
        weeklyTransactions.forEach(transaction => {
            const category = transaction.transaction.category;
            const day = new Date(transaction.transaction.date).toLocaleDateString();
            
            categoryBreakdown[category] = (categoryBreakdown[category] || 0) + transaction.transaction.amount;
            dailyBreakdown[day] = (dailyBreakdown[day] || 0) + transaction.transaction.amount;
        });

        return {
            startDate: startOfWeek.toISOString().split('T')[0],
            endDate: endOfWeek.toISOString().split('T')[0],
            totalSpent,
            transactionCount: weeklyTransactions.length,
            categoryBreakdown,
            dailyBreakdown,
            transactions: weeklyTransactions
        };
    }

    getSpendingTrends(months = 6) {
        const trends = [];
        const now = new Date();
        
        for (let i = months - 1; i >= 0; i--) {
            const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const report = this.getMonthlyReport(targetDate.getFullYear(), targetDate.getMonth());
            
            trends.push({
                period: `${report.monthName} ${report.year}`,
                totalSpent: report.totalSpent,
                transactionCount: report.transactionCount
            });
        }
        
        return trends;
    }

    addCategory(name, bgLimit) {
        const obj = new Category(name, bgLimit);
        this.categories.push(obj);
    }

    totalAmount() {
        return this.expenses.reduce((acc, curr) => acc + curr.amount, 0);
    }

    mergeDefaults() {
        // Merge default categories if they don't exist
        const defaultCategories = ["food", "commute", "entertainment", "utility"];
        for (const name of defaultCategories) {
            const exists = this.categories.some(cat => cat.name === name);
            if (!exists) {
                const default_category = new Category(name, 100);
                this.categories.push(default_category);
            }
        }

        // Merge default payment methods if they don't exist
        const defaultPayMethods = ["cash", "upi"];
        for (const name of defaultPayMethods) {
            const exists = this.paymentmethods.some(method => method.type === name);
            if (!exists) {
                const def = new PaymentMethod(name, name);
                this.paymentmethods.push(def);
            }
        }
    }

    transitionsLog() {
        return this.transactions;
    }

    categoriesReport() {
        const dict = {};
        for (const cat of this.categories) {
            dict[cat.name] = cat.amount;
        }
        return dict;
    }

    loadExpense() {
        const data = this.safeLocalStorageGet("expenses");
        if (data) {
            const parsed = this.safeJSONParse(data, []);
            this.expenses = parsed.map(obj => new Expense(obj.amount, obj.description, obj.date, obj.category));
        }
    }

    saveExpense() {
        const success = this.safeLocalStorageSet("expenses", JSON.stringify(this.expenses));
        return success;
    }

    loadCategories() {
        const data = this.safeLocalStorageGet("categories");
        if (data) {
            const parsed = this.safeJSONParse(data, []);
            this.categories = parsed.map(obj => {
                const cat = new Category(obj.name, obj.budgetLimit);
                cat.amount = obj.amount;
                return cat;
            });
        }
    }

    saveCategories() {
        const success = this.safeLocalStorageSet("categories", JSON.stringify(this.categories));
        return success;
    }

    loadPaymentMethods() {
        const data = this.safeLocalStorageGet("paymentmethods");
        if (data) {
            const parsed = this.safeJSONParse(data, []);
            this.paymentmethods = parsed.map(obj => {
                const method = new PaymentMethod(obj.type, obj.details);
                method.amount = obj.amount;
                return method;
            });
        }
    }

    savePaymentMethods() {
        const success = this.safeLocalStorageSet("paymentmethods", JSON.stringify(this.paymentmethods));
        return success;
    }

    loadTransactions() {
        const data = this.safeLocalStorageGet("transactions");
        if (data) {
            const parsed = this.safeJSONParse(data, []);
            this.transactions = parsed.map(obj => {
                const exp = new Expense(obj.transaction.amount, obj.transaction.description, obj.transaction.date, obj.transaction.category);
                return new Transaction(exp, obj.status);
            });
        }
    }

    saveTransactions() {
        const success = this.safeLocalStorageSet("transactions", JSON.stringify(this.transactions));
        return success;
    }

    loadAll() {
        this.loadExpense();
        this.loadCategories();
        this.loadPaymentMethods();
        this.loadTransactions();
    }

    saveAll() {
        const results = [
            this.saveExpense(),
            this.saveCategories(),
            this.savePaymentMethods(),
            this.saveTransactions()
        ];
        return results.every(result => result === true);
    }

    deleteAll(){
        this.expenses = [];
        this.categories = [];
        this.transactions = [];
        this.paymentmethods = [];

        // Also clear from localStorage
        const results = [
            this.safeLocalStorageRemove("expenses"),
            this.safeLocalStorageRemove("categories"),
            this.safeLocalStorageRemove("transactions"),
            this.safeLocalStorageRemove("paymentmethods")
        ];
        return results.every(result => result === true);
    }

    // Error handling methods
    handleStorageError(operation, error) {
        const errorMsg = `Storage ${operation} failed: ${error.message}`;
        console.error(errorMsg);
        this.errors.push({
            operation,
            error: error.message,
            timestamp: new Date().toISOString()
        });

        // Show user-friendly error message
        if (error.name === 'QuotaExceededError') {
            alert('Storage limit exceeded. Please clear some data or use a different browser.');
        } else {
            alert('An error occurred while saving data. Please try again.');
        }
    }

    safeLocalStorageGet(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            this.handleStorageError('read', error);
            return null;
        }
    }

    safeLocalStorageSet(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            this.handleStorageError('write', error);
            return false;
        }
    }

    safeLocalStorageRemove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            this.handleStorageError('delete', error);
            return false;
        }
    }

    safeJSONParse(jsonString, fallback = []) {
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.error('JSON parsing failed:', error);
            this.errors.push({
                operation: 'parse',
                error: error.message,
                timestamp: new Date().toISOString()
            });
            return fallback;
        }
    }
}