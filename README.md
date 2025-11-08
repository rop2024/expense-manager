# 💰 Expense Tracker

A modern, feature-rich expense tracking application built with vanilla JavaScript and styled with Tailwind CSS. Track your daily expenses, categorize spending, monitor payment methods, and maintain detailed transaction logs.

![GitHub](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.1.11-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Features

### 📝 Expense Management
- **Add Expenses**: Record expenses with amount, description, date, category, and payment method
- **Real-time Validation**: 
  - Ensures all required fields are filled
  - Validates numeric input for amounts
  - Prevents future dates from being selected
  - Provides immediate user feedback
- **Total Overview**: View total spending in real-time with a prominent display (₹0.00 format)
- **Persistent Storage**: All data is saved locally using browser's localStorage

### 🏷️ Category Tracking
- **Default Categories**: Pre-loaded with common categories:
  - Food
  - Commute
  - Entertainment
  - Utility
- **Dynamic Categories**: Automatically creates new categories when you enter custom ones
- **Budget Monitoring**: Set budget limits per category (default: ₹100)
- **Spending Overview**: View total amount spent in each category
- **Budget Alerts**: System tracks when spending exceeds category budget limits

### 💳 Payment Method Analysis
- **Multiple Payment Options**: Support for various payment methods
  - Cash
  - UPI
  - Custom payment methods (automatically added)
- **Payment Summary**: View spending breakdown by payment method
- **Amount Tracking**: Monitor how much you've spent through each payment method

### 📊 Transaction Logs
- **Complete History**: View all recorded transactions with full details:
  - Amount
  - Description
  - Category
  - Date
- **Chronological Display**: Transactions displayed in order of entry
- **Visual Design**: Each transaction displayed in an easy-to-read card format
- **Export Functionality**: Download all transaction data as JSON file
- **No Data Handling**: Graceful messaging when no transactions exist

### 🎨 User Interface
- **Dark Theme**: Modern dark mode interface (gray-900 background)
- **Responsive Design**: Fully responsive layout that works on:
  - Desktop (lg breakpoint)
  - Tablet
  - Mobile devices
- **Smooth Animations**: 
  - Hover effects on buttons
  - Smooth transitions
  - Scale transforms on interactive elements
- **Custom Styling**:
  - Rounded corners and shadows
  - Focus states with blue ring indicators
  - Custom scrollbars for long lists
- **Loading States**: Built-in loading indicators for async operations
- **Color-Coded Elements**:
  - Blue for primary actions
  - Green for monetary displays
  - Yellow for warnings/messages
  - Red for delete actions

### 🔧 Data Management
- **Clear All Records**: Delete all expenses, categories, payment methods, and transactions
- **Confirmation Dialog**: Prevents accidental data deletion
- **Fresh Start**: Ability to reset the application completely
- **Data Persistence**: Automatic saving after each operation

### 🧩 Modular Architecture
- **Object-Oriented Design**: Built with ES6 classes
  - `Expense`: Individual expense records
  - `Category`: Category management with budget tracking
  - `PaymentMethod`: Payment method tracking
  - `Transaction`: Transaction history management
  - `Base`: Main controller class coordinating all operations
- **Module System**: ES6 modules for clean code organization
- **Separation of Concerns**: Each page has dedicated scripts:
  - `script.js`: Main expense entry
  - `category.js`: Category display
  - `paymethod.js`: Payment method summary
  - `transaction.js`: Transaction log display

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js (for Tailwind CSS compilation, if needed)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rop2024/expense-manager.git
   cd expense-manager
   ```

2. **Install dependencies** (for Tailwind CSS)
   ```bash
   npm install
   ```

3. **Open the application**
   - Simply open `index.html` in your web browser
   - Or use a local server (e.g., Live Server, Five Server)

### Usage

#### Adding an Expense
1. Enter the expense amount (e.g., 150.75)
2. Provide a description (e.g., "Groceries for dinner")
3. Select or enter the date
4. Specify the category (e.g., "Food", "Commute")
5. Enter the payment method (e.g., "UPI", "Cash")
6. Click "Add Expense"

#### Viewing Categories
- Click on "Categories Wise Spend" button
- See all categories with amounts spent
- View budget limits vs actual spending

#### Checking Payment Methods
- Click on "Payment Method Details" button
- View spending breakdown by payment method

#### Reviewing Transaction History
- Click on "Transaction Logs" button
- Browse all recorded expenses
- Download transaction data using "Download Transactions" button

#### Clearing Data
- Click "Clear All Records" button on the main page
- Confirm the action in the dialog
- All data will be permanently deleted

## 📁 Project Structure

```
expense-tracker/
├── index.html              # Main application page
├── package.json            # Dependencies and scripts
├── README.md              # This file
├── 04_expense_tracker/    # Alternative version
├── pages/                 # Additional pages
│   ├── categories.html    # Category overview page
│   ├── paymethod.html     # Payment method summary page
│   └── transaction.html   # Transaction logs page
├── scripts/               # JavaScript modules
│   ├── main.js           # Main controller (Base class)
│   ├── classes.js        # Core class definitions
│   ├── script.js         # Main page logic
│   ├── category.js       # Category page logic
│   ├── paymethod.js      # Payment method page logic
│   └── transaction.js    # Transaction page logic
└── src/                  # Styles
    ├── input.css         # Tailwind input
    ├── output.css        # Compiled Tailwind CSS
    ├── categories.css    # Category page styles
    ├── paymethod.css     # Payment method page styles
    └── transaction.css   # Transaction page styles
```

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS v4.1.11
- **Storage**: Browser localStorage API
- **Module System**: ES6 Modules
- **Architecture**: Object-Oriented Programming (OOP)

## 💾 Data Storage

The application uses browser's `localStorage` to persist data across sessions. Data is stored in the following keys:
- `expenses`: Array of all expense records
- `categories`: Array of categories with budget and spending data
- `paymentmethods`: Array of payment methods with spending totals
- `transactions`: Array of transaction logs with status

## 🎯 Key Classes

### Expense
Represents a single expense with amount, description, date, and category.

### Category
Manages spending categories with budget limits and tracks total spending per category.

### PaymentMethod
Tracks different payment methods and accumulates spending per method.

### Transaction
Records transaction history with expense details and status.

### Base
Main controller class that:
- Manages all expenses, categories, payment methods, and transactions
- Handles data persistence (load/save operations)
- Coordinates between different components
- Provides data aggregation methods

## ⚡ Features Highlights

- ✅ **Zero Dependencies** (runtime): Pure vanilla JavaScript
- ✅ **No Backend Required**: Fully client-side application
- ✅ **Privacy First**: All data stored locally in your browser
- ✅ **Fast & Lightweight**: No server calls, instant updates
- ✅ **Offline Capable**: Works without internet connection
- ✅ **Export Ready**: Download data for backup or analysis

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 👨‍💻 Developer

Made with ❤️ by [rop2024](https://github.com/rop2024)

## 📝 License

This project is open source and available under the MIT License.

## 🔮 Future Enhancements

Potential features for future versions:
- Charts and graphs for spending visualization
- Monthly/weekly spending reports
- Budget alerts and notifications
- Export to CSV/Excel formats
- Recurring expense tracking
- Multi-currency support
- Dark/Light theme toggle
- Search and filter functionality
- Expense editing capabilities
- Cloud sync option

---

**Note**: This application stores all data locally in your browser. Clear browser data will result in loss of all expense records. Use the export feature to backup your data regularly.
