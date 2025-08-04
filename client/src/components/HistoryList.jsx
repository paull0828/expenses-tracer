import { useEffect, useState } from "react";
import {
  Edit,
  Trash2,
  Save,
  XCircle,
  PlusCircle,
  MinusCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { entryAPI } from "../services/api";

export default function HistoryList({ refresh }) {
  const [entries, setEntries] = useState([]);
  const [editEntryId, setEditEntryId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [page, setPage] = useState(1);
  const limit = 5;
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const fetchEntries = async () => {
    setIsLoading(true);
    setFetchError("");
    try {
      const res = await entryAPI.getEntries(page, limit);
      setEntries(res.entries || []);
    } catch (err) {
      console.error("Error fetching entries:", err.message);
      setFetchError("Failed to load history. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [page, refresh]);

  const handleEditClick = (entry) => {
    setEditEntryId(entry._id);
    setEditedData({
      income: entry.income,
      description: entry.description || "",
      expenses: entry.expenses.map((e) => ({ ...e })),
    });
  };

  const handleCancelEdit = () => {
    setEditEntryId(null);
    setEditedData({});
  };

  const handleInputChange = (index, field, value) => {
    const updatedExpenses = [...editedData.expenses];
    updatedExpenses[index][field] = value;
    setEditedData({ ...editedData, expenses: updatedExpenses });
  };

  const handleIncomeChange = (value) => {
    setEditedData({ ...editedData, income: Number(value) });
  };

  const handleDescriptionChange = (value) => {
    setEditedData({ ...editedData, description: value });
  };

  const handleAddExpense = () => {
    setEditedData({
      ...editedData,
      expenses: [...editedData.expenses, { amount: "", description: "" }],
    });
  };

  const handleRemoveExpense = (index) => {
    const updated = editedData.expenses.filter((_, i) => i !== index);
    setEditedData({ ...editedData, expenses: updated });
  };

  const calculateSaving = (income, expenses) => {
    return (
      Number(income || 0) -
      expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
    );
  };

  const handleSave = async () => {
    if (!editEntryId) return;
    if (!editedData.income || isNaN(Number(editedData.income))) {
      alert("Please enter a valid income.");
      return;
    }
    if (
      editedData.expenses?.some(
        (exp) => !exp.description || isNaN(Number(exp.amount))
      )
    ) {
      alert("Please fill all expense fields correctly.");
      return;
    }
    try {
      await entryAPI.updateEntry(editEntryId, editedData);
      setEditEntryId(null);
      setEditedData({});
      fetchEntries();
    } catch (err) {
      console.error("Error updating entry:", err.message);
      alert("Failed to update entry. Try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await entryAPI.deleteEntry(id);
      fetchEntries();
    } catch (err) {
      console.error("Error deleting entry:", err.message);
      alert("Failed to delete entry. Try again.");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-8">
      <div className="pb-4 mb-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Expense History
        </h2>
        <p className="text-center text-gray-600 text-sm mt-1">
          Review and manage your past entries.
        </p>
      </div>
      {isLoading && (
        <p className="text-center text-gray-500 py-4">Loading entries...</p>
      )}
      {fetchError && (
        <p className="text-center text-accent-600 py-4">{fetchError}</p>
      )}
      {!isLoading && !fetchError && entries.length === 0 && (
        <p className="text-center text-gray-500 py-4">
          No entries found. Start by adding one!
        </p>
      )}
      {!isLoading &&
        !fetchError &&
        entries.map((entry) => (
          <div
            key={entry._id}
            className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 transition-all duration-300 ease-in-out hover:shadow-md"
          >
            <div className="flex justify-between items-start gap-4 border-b border-gray-100 pb-3 mb-3">
              <div>
                <p className="text-xs text-gray-500">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </p>
                {editEntryId === entry._id ? (
                  <>
                    <input
                      type="number"
                      value={editedData.income}
                      onChange={(e) => handleIncomeChange(e.target.value)}
                      className="mt-1 block w-32 text-lg font-semibold border border-gray-300 rounded-md px-2 py-1 focus:ring-primary-300 focus:border-primary-500 outline-none"
                      placeholder="Income"
                    />
                    <input
                      type="text"
                      value={editedData.description}
                      onChange={(e) => handleDescriptionChange(e.target.value)}
                      className="mt-2 block w-full text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-primary-300 focus:border-primary-500 outline-none"
                      placeholder="Description (optional)"
                    />
                  </>
                ) : (
                  <>
                    <p className="text-primary-600 font-bold text-xl">
                      ₹{entry.income.toLocaleString()}
                    </p>
                    {entry.description && (
                      <p className="text-gray-700 text-sm mt-1">
                        {entry.description}
                      </p>
                    )}
                  </>
                )}
              </div>
              <div className="flex gap-2">
                {editEntryId === entry._id ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="p-2 rounded-full text-green-600 hover:bg-green-100 transition-colors duration-200"
                      aria-label="Save changes"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors duration-200"
                      aria-label="Cancel edit"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditClick(entry)}
                      className="p-2 rounded-full text-primary-600 hover:bg-primary-100 transition-colors duration-200"
                      aria-label="Edit entry"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry._id)}
                      className="p-2 rounded-full text-accent-600 hover:bg-accent-100 transition-colors duration-200"
                      aria-label="Delete entry"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="mt-3">
              <p className="font-medium text-gray-700 mb-2">Expenses:</p>
              {editEntryId === entry._id ? (
                <div className="space-y-2">
                  {editedData.expenses.map((expense, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap items-center gap-2"
                    >
                      <input
                        type="text"
                        value={expense.description}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        className="flex-1 min-w-[120px] px-2 py-1 border border-gray-300 rounded-md focus:ring-primary-300 focus:border-primary-500 outline-none"
                        placeholder="Description"
                      />
                      <input
                        type="number"
                        value={expense.amount}
                        onChange={(e) =>
                          handleInputChange(index, "amount", e.target.value)
                        }
                        className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:ring-primary-300 focus:border-primary-500 outline-none"
                        placeholder="Amount"
                      />
                      {editedData.expenses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveExpense(index)}
                          className="text-accent-500 hover:text-accent-700 transition-colors duration-200 p-1 rounded-full"
                          aria-label="Remove expense"
                        >
                          <MinusCircle className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddExpense}
                    className="flex items-center text-sm text-primary-600 mt-2 hover:text-primary-700 transition-colors duration-200"
                  >
                    <PlusCircle className="mr-1 w-4 h-4" /> Add Expense
                  </button>
                  <p
                    className={`mt-2 font-semibold text-lg ${
                      calculateSaving(editedData.income, editedData.expenses) >=
                      0
                        ? "text-secondary-600"
                        : "text-accent-600"
                    }`}
                  >
                    Saving: ₹
                    {calculateSaving(
                      editedData.income,
                      editedData.expenses
                    ).toLocaleString()}
                  </p>
                </div>
              ) : (
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {entry.expenses.length > 0 ? (
                    entry.expenses.map((expense, i) => (
                      <li key={i} className="flex justify-between items-center">
                        <span>{expense.description}</span>
                        <span className="font-medium">
                          ₹{Number(expense.amount).toLocaleString()}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No expenses recorded.</li>
                  )}
                </ul>
              )}
            </div>
            {editEntryId !== entry._id && (
              <p
                className={`text-right mt-3 font-bold text-lg ${
                  calculateSaving(entry.income, entry.expenses) >= 0
                    ? "text-secondary-600"
                    : "text-accent-600"
                }`}
              >
                Saving: ₹
                {calculateSaving(entry.income, entry.expenses).toLocaleString()}
              </p>
            )}
          </div>
        ))}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="p-2 rounded-full text-gray-600 hover:text-gray-800 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors duration-200"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-lg font-medium text-gray-800">{page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={entries.length < limit && page > 0 && !isLoading}
          className="p-2 rounded-full text-gray-600 hover:text-gray-800 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors duration-200"
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
