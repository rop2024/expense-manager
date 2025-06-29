// Classes

export class Expense {
    constructor(amount, description, date, category) {
        this.amount = amount;
        this.description = description;
        this.date = date;
        this.category = category;
    }
}

export class Category {
    constructor(name, budgetLimit) {
        this.name = name;
        this.budgetLimit = budgetLimit;
        this.amount = 0;
    }

    appendAmount(amt) {
        this.amount += amt;
    }

    check() {
        return this.budgetLimit > this.amount;
    }
}

export class PaymentMethod {
    constructor(type, details) {
        this.type = type;
        this.details = details;
        this.amount = 0;
    }

    set_details(strings) {
        this.details = strings;
    }

    appendAmount(amt) {
        this.amount += amt;
    }
}

export class Transaction {
    constructor(transaction, status) {
        this.transaction = transaction;
        this.status = status;
    }
}
