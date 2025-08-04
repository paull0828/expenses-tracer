"use client";

import { useState } from "react";
import { PlusCircle, MinusCircle } from "lucide-react";
import { entryAPI } from "../services/api";

export default function DashboardForm({ onEntryAdded }) {
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState([{ amount: "", description: "" }]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleExpenseChange = (index, field, value) => {
    const updated = [...expenses];
    updated[index][field] = value;
    setExpenses(updated);
  };

  const addExpenseField = () => {
    setExpenses([...expenses, { amount: "", description: "" }]);
  };

  const removeExpenseField = (index) => {
    const updated = expenses.filter((_, i) => i !== index);
    setExpenses(updated);
  };

  const calculateSaving = () => {
    return (
      Number(income || 0) -
      expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    if (!income || isNaN(Number(income))) {
      setMessage("Please enter a valid income.");
      setIsSubmitting(false);
      return;
    }
    if (
      expenses.some(
        (exp) => !exp.description || !exp.amount || isNaN(Number(exp.amount))
      )
    ) {
      setMessage("Please fill all expense fields correctly.");
      setIsSubmitting(false);
      return;
    }

    const saving = calculateSaving();
    if (
      saving < 0 &&
      !window.confirm(
        `Warning: Negative saving (₹${saving.toLocaleString()}). Continue?`
      )
    ) {
      setIsSubmitting(false);
      return;
    }

    const entryData = {
      income: Number(income),
      expenses: expenses.map((exp) => ({
        amount: Number(exp.amount),
        description: exp.description,
      })),
    };

    try {
      await entryAPI.addEntry(entryData);
      setIncome("");
      setExpenses([{ amount: "", description: "" }]);
      onEntryAdded();
      setMessage("✅ Entry saved successfully!");
    } catch (err) {
      console.error("Error adding entry:", err);
      setMessage("❌ Failed to save entry. Please log in again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-8">
      <div className="pb-4 mb-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Add New Entry
        </h2>
        <p className="text-center text-gray-600 text-sm mt-1">
          Record your income and expenses for today.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
          <div
            className={`text-center text-sm p-2 rounded-md ${
              message.startsWith("✅")
                ? "bg-secondary-100 text-secondary-700"
                : "bg-accent-100 text-accent-700"
            }`}
          >
            {message}
          </div>
        )}
        <div>
          <label
            htmlFor="income"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Income (₹)
          </label>
          <input
            id="income"
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="Enter your total income"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 outline-none transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expenses
          </label>
          <div className="space-y-3">
            {expenses.map((expense, index) => (
              <div key={index} className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={expense.description}
                  onChange={(e) =>
                    handleExpenseChange(index, "description", e.target.value)
                  }
                  placeholder="Expense description (e.g., Groceries)"
                  className="flex-1 min-w-[120px] p-2 border border-gray-300 rounded-md focus:ring-primary-300 focus:border-primary-500 outline-none"
                />
                <input
                  type="number"
                  value={expense.amount}
                  onChange={(e) =>
                    handleExpenseChange(index, "amount", e.target.value)
                  }
                  placeholder="Amount"
                  className="w-24 p-2 border border-gray-300 rounded-md focus:ring-primary-300 focus:border-primary-500 outline-none"
                />
                {expenses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExpenseField(index)}
                    className="text-accent-500 hover:text-accent-700 transition-colors duration-200 p-1 rounded-full"
                    aria-label="Remove expense field"
                  >
                    <MinusCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addExpenseField}
            className="mt-3 flex items-center text-sm text-primary-600 hover:text-primary-700 transition-colors duration-200"
          >
            <PlusCircle className="mr-1 w-4 h-4" /> Add Another Expense
          </button>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-gray-100">
          <p
            className={`text-xl font-bold mb-4 sm:mb-0 ${
              calculateSaving() >= 0 ? "text-secondary-600" : "text-accent-600"
            }`}
          >
            Saving: ₹{calculateSaving().toLocaleString()}
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary-600 text-secondary-100 px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              "Save Entry"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
