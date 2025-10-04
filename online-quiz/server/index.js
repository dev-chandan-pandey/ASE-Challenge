// index.js - main server
const express = require("express");
const cors = require("cors");
const path = require("path");
const quizRoutes = require("./routes/quiz");
const { db } = require("./db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4001;

const allowedOrigins = [
  "https://ase-challenge-omega.vercel.app",
  "http://localhost:3000", // for local dev
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());

// basic health
app.get("/", (req, res) => res.json({ ok: true }));

// quiz routes
app.use("/quiz", quizRoutes);

// start
app.listen(PORT, () => {
  console.log(`Quiz server running on http://localhost:${PORT}`);
});
