const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend files from /public
app.use(express.static(path.join(__dirname, "public")));

// In-memory totals
let totalRating = 0;
let totalResponses = 0;

// IMPORTANT: This is the key fix for the "already submitted" problem.
// resetAt is created when server starts and updates when /api/reset is called.
let resetAt = new Date().toISOString();

// POST route — receive feedback
app.post("/api/submit", (req, res) => {
  const { rating } = req.body;

  if (typeof rating === "number" && rating >= 1 && rating <= 10) {
    totalRating += rating;
    totalResponses++;

    return res.json({
      message: "Rating received!",
      totalRating,
      totalResponses,
      resetAt
    });
  } else {
    return res.status(400).json({ error: "Invalid rating value" });
  }
});

// GET route — return current totals
app.get("/api/total", (req, res) => {
  return res.json({
    totalRating,
    totalResponses,
    resetAt
  });
});

// DEV ONLY: reset totals
app.post("/api/reset", (req, res) => {
  totalRating = 0;
  totalResponses = 0;
  resetAt = new Date().toISOString(); // NEW reset timestamp

  return res.json({
    message: "Reset done",
    totalRating,
    totalResponses,
    resetAt
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
