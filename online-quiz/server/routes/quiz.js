// routes/quiz.js
const express = require("express");
const router = express.Router();
const { all, get } = require("../db");

// GET /quiz/:id/questions
// Returns questions for the quiz WITHOUT the correct answers.
router.get("/:quizId/questions", async (req, res) => {
  const quizId = Number(req.params.quizId);
  if (!quizId) return res.status(400).json({ error: "invalid quiz id" });
  try {
    const questions = await all(
      "SELECT id, text, option_a as a, option_b as b, option_c as c, option_d as d FROM questions WHERE quiz_id = ?",
      [quizId]
    );
    res.json({ quizId, questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

// POST /quiz/:id/submit
// Accepts answers: { answers: [{ questionId: 1, answer: "a" }, ...] }
// Returns { total, correct, details: [{ questionId, correctAnswer, userAnswer, isCorrect }] }
router.post("/:quizId/submit", async (req, res) => {
  const quizId = Number(req.params.quizId);
  const { answers } = req.body || {};
  if (!quizId || !Array.isArray(answers)) {
    return res.status(400).json({ error: "invalid request" });
  }

  try {
    // Fetch correct answers for the quiz
    const rows = await all("SELECT id, correct_option FROM questions WHERE quiz_id = ?", [quizId]);
    const correctMap = {};
    rows.forEach(r => (correctMap[r.id] = r.correct_option));

    // Score
    let correct = 0;
    const details = answers.map(ans => {
      const qid = Number(ans.questionId);
      const userAnswer = (ans.answer || "").toLowerCase();
      const correctAnswer = correctMap[qid] || null;
      const isCorrect = correctAnswer && userAnswer === correctAnswer;
      if (isCorrect) correct++;
      return { questionId: qid, userAnswer, correctAnswer, isCorrect: !!isCorrect };
    });

    res.json({ total: answers.length, correct, details });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

module.exports = router;
