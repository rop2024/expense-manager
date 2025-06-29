import { Expense, Category, PaymentMethod, Transaction } from "./classes.js";

export class Base {
    constructor() {
        this.expenses = [];
        this.categories = [];
        this.paymentmethods = [];
        this.transactions = [];

        this.defaultCategories();
        this.defaultPayMethods();

        this.loadAll();
    }

    addExpense(exp, desp, date, category, pay_method) {
        const categoryLower = category.toLowerCase();
        const payLower = pay_method.toLowerCase();

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
        this.saveAll();
        console.log("Expense added !!");
    }

    addCategory(name, bgLimit) {
        const obj = new Category(name, bgLimit);
        this.categories.push(obj);
    }

    totalAmount() {
        return this.expenses.reduce((acc, curr) => acc + curr.amount, 0);
    }

    defaultCategories() {
        const categoriesRef = ["food", "commute", "entertainment", "utility"];
        for (const name of categoriesRef) {
            const default_category = new Category(name, 100);
            this.categories.push(default_category);
        }
    }

    defaultPayMethods() {
        const reference = ["cash", "upi"];
        for (const name of reference) {
            const def = new PaymentMethod(name, name);
            this.paymentmethods.push(def);
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
        const data = localStorage.getItem("expenses");
        if (data) {
            const parsed = JSON.parse(data);
            this.expenses = parsed.map(obj => new Expense(obj.amount, obj.description, obj.date, obj.category));
        }
    }

    saveExpense() {
        localStorage.setItem("expenses", JSON.stringify(this.expenses));
    }

    loadCategories() {
        const data = localStorage.getItem("categories");
        if (data) {
            const parsed = JSON.parse(data);
            this.categories = parsed.map(obj => {
                const cat = new Category(obj.name, obj.budgetLimit);
                cat.amount = obj.amount;
                return cat;
            });
        }
    }

    saveCategories() {
        localStorage.setItem("categories", JSON.stringify(this.categories));
    }

    loadPaymentMethods() {
        const data = localStorage.getItem("paymentmethods");
        if (data) {
            const parsed = JSON.parse(data);
            this.paymentmethods = parsed.map(obj => {
                const method = new PaymentMethod(obj.type, obj.details);
                method.amount = obj.amount;
                return method;
            });
        }
    }

    savePaymentMethods() {
        localStorage.setItem("paymentmethods", JSON.stringify(this.paymentmethods));
    }

    loadTransactions() {
        const data = localStorage.getItem("transactions");
        if (data) {
            const parsed = JSON.parse(data);
            this.transactions = parsed.map(obj => {
                const exp = new Expense(obj.transaction.amount, obj.transaction.description, obj.transaction.date, obj.transaction.category);
                return new Transaction(exp, obj.status);
            });
        }
    }

    saveTransactions() {
        localStorage.setItem("transactions", JSON.stringify(this.transactions));
    }

    loadAll() {
        this.loadExpense();
        this.loadCategories();
        this.loadPaymentMethods();
        this.loadTransactions();
    }

    saveAll() {
        this.saveExpense();
        this.saveCategories();
        this.savePaymentMethods();
        this.saveTransactions();
    }

    deleteAll(){
        this.expenses = [];
        this.categories = [];
        this.transactions = [];
        this.paymentmethods = [];

        // Also clear from localStorage
        localStorage.removeItem("expenses");
        localStorage.removeItem("categories");
        localStorage.removeItem("transactions");
        localStorage.removeItem("paymentmethods");
    }
}