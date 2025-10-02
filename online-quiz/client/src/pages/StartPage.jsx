import React from "react";

export default function StartPage({ onStart }) {
  // Simple single quiz for now; could fetch list of quizzes.
  return (
    <div className="start">
      <h1>Welcome to the Quiz</h1>
      <p>Test your knowledge — 5 questions. Timer enabled.</p>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn" onClick={() => onStart(1)}>Start Quiz</button>
      </div>
    </div>
  );
}
