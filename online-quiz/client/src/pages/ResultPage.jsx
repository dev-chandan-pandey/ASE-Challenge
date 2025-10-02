import React from "react";

export default function ResultPage({ result, onRetry }) {
  if (!result) return <div>Result not available.</div>;

  return (
    <div className="result">
      <h1>Your Score</h1>
      <p>
        You answered {result.correct} out of {result.total} correctly.
      </p>

      <div className="result-list">
        {result.details && result.details.map(d => (
          <div key={d.questionId} className={`result-item ${d.isCorrect ? "correct" : "wrong"}`}>
            <div>Question ID: {d.questionId}</div>
            <div>Your answer: {d.userAnswer || "—"}</div>
            <div>Correct answer: {d.correctAnswer || "—"}</div>
            <div>Status: {d.isCorrect ? "Correct" : "Wrong"}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <button className="btn" onClick={onRetry}>Take again</button>
      </div>
    </div>
  );
}
