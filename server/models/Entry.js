const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  income: {
    type: Number,
    required: true,
  },
  expenses: [
    {
      amount: { type: Number, required: true },
      description: { type: String, required: true },
    },
  ],
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Entry", entrySchema);
