const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// serve frontend files from /public
app.use(express.static(path.join(__dirname, "public")));

let totalRating = 0;
let totalResponses = 0;

// POST route to receive feedback
app.post("/api/submit", (req, res) => {
  const { rating } = req.body;
  if (typeof rating === "number" && rating >= 1 && rating <= 10) {
    totalRating += rating;
    totalResponses++;
    res.json({ message: "Rating received!", totalRating, totalResponses });
  } else {
    res.status(400).json({ error: "Invalid rating value" });
  }
});

// GET route to display total
app.get("/api/total", (req, res) => {
  res.json({ totalRating, totalResponses });
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
