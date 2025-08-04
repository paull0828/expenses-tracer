const Entry = require("../models/Entry");

// GET /api/entries/history?page=&limit=
const getEntries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const entries = await Entry.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Entry.countDocuments({ userId: req.user.id });
    const totalPages = Math.ceil(total / limit);

    res.json({ entries, totalPages });
  } catch (err) {
    res.status(500).json({ message: "Error fetching entries" });
  }
};

// POST /api/entries/add
const addEntry = async (req, res) => {
  const { income, expenses, description } = req.body;
  const userId = req.user.id;

  try {
    const newEntry = await Entry.create({
      userId,
      income,
      expenses,
      description,
    });

    res.status(201).json({
      message: "Entry saved",
      entry: newEntry,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to save entry",
      error: err.message,
    });
  }
};

// ✅ PUT /api/entries/:id
const updateEntry = async (req, res) => {
  const { id } = req.params;
  const { income, expenses, description } = req.body;

  try {
    const updated = await Entry.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { income, expenses, description },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Entry not found or unauthorized" });
    }

    res.json({ message: "Entry updated", entry: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update entry", error: err.message });
  }
};

// ✅ DELETE /api/entries/:id
const deleteEntry = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Entry.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Entry not found or unauthorized" });
    }

    res.json({ message: "Entry deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete entry", error: err.message });
  }
};

module.exports = {
  getEntries,
  addEntry,
  updateEntry,
  deleteEntry,
};
