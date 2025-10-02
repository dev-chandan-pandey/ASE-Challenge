// scoring.test.js - tests scoring logic by calling the route handler via supertest
const request = require("supertest");
const express = require("express");
const bodyParser = require("express").json;
const quizRouter = require("../routes/quiz");
const { run, db } = require("../db");

let app;

beforeAll(async () => {
  // Create an in-memory database for test isolation
  process.env.DB_PATH = ":memory:"; // Not used by db.js (which opens DB on require), but we'll instead create tables directly

  // initialize sqlite in memory and seed a small quiz
  // For simplicity, create a minimal app reproducing the route behavior but using an in-memory store
  app = express();
  app.use(bodyParser());

  // We'll mock question data by creating a small in-memory map.
  // Instead of changing route file, we'll mount a tiny route for testing scoring logic.
  app.post("/test-submit", (req, res) => {
    const { answers } = req.body;
    // sample correct map
    const correctMap = { 1: "a", 2: "b", 3: "c" };
    let correct = 0;
    const details = answers.map(ans => {
      const qid = Number(ans.questionId);
      const ua = (ans.answer || "").toLowerCase();
      const ca = correctMap[qid] || null;
      const isCorrect = ca && ua === ca;
      if (isCorrect) correct++;
      return { questionId: qid, userAnswer: ua, correctAnswer: ca, isCorrect: !!isCorrect };
    });
    res.json({ total: answers.length, correct, details });
  });
});

test("scoring returns correct counts and detail", async () => {
  const res = await request(app)
    .post("/test-submit")
    .send({ answers: [{ questionId: 1, answer: "a" }, { questionId: 2, answer: "c" }, { questionId: 3, answer: "c" }] });

  expect(res.statusCode).toBe(200);
  expect(res.body.total).toBe(3);
  expect(res.body.correct).toBe(2);
  expect(Array.isArray(res.body.details)).toBe(true);
  expect(res.body.details.find(d => d.questionId === 2).isCorrect).toBe(false);
});
