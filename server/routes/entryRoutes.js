const express = require("express");
const router = express.Router();
const {
  addEntry,
  getEntries,
  updateEntry,
  deleteEntry,
} = require("../controllers/entryController");
const authMiddleware = require("../midlleware/authMiddleware");

// Protected routes
router.post("/add", authMiddleware, addEntry);
router.get("/history", authMiddleware, getEntries);

// ✅ NEW routes for Edit/Delete
router.put("/:id", authMiddleware, updateEntry);
router.delete("/:id", authMiddleware, deleteEntry);

module.exports = router;
