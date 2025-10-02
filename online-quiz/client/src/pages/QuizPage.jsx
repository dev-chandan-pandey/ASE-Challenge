import React, { useEffect, useState } from "react";
import Timer from "../components/Timer";

export default function QuizPage({ questions, answers, setAnswers, onSubmit, onCancel }) {
  const [index, setIndex] = useState(0);
  const total = questions.length;
  const [duration] = useState(60 * 3); // 3 minutes for the whole quiz

  useEffect(() => {
    setIndex(0);
  }, [questions]);

  const current = questions[index] || null;

  const choose = (qid, opt) => {
    setAnswers(prev => ({ ...prev, [qid]: opt }));
  };

  const handleExpire = () => {
    // auto-submit with whatever answers user provided
    onSubmit(answers);
  };

  return (
    <div className="quiz">
      <div className="quiz-header">
        <h2>Question {index + 1} of {total}</h2>
        <Timer duration={duration} onExpire={handleExpire} />
      </div>

      {current ? (
        <div className="question-card">
          <p className="q-text">{current.text}</p>
          <div className="options">
            {["a", "b", "c", "d"].map(k => {
              const text = current[k];
              if (!text) return null;
              return (
                <label key={k} className={`option ${answers[current.id] === k ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name={`q${current.id}`}
                    checked={answers[current.id] === k}
                    onChange={() => choose(current.id, k)}
                  />
                  <span className="opt-key">{k.toUpperCase()}.</span> <span>{text}</span>
                </label>
              );
            })}
          </div>

          <div className="nav">
            <button className="btn secondary" onClick={() => { if (index > 0) setIndex(index - 1); }}>Previous</button>
            {index < total - 1 ? (
              <button className="btn" onClick={() => { if (index < total - 1) setIndex(index + 1); }}>Next</button>
            ) : (
              <button className="btn" onClick={() => onSubmit(answers)}>Submit</button>
            )}
          </div>

          <div style={{ marginTop: 12 }}>
            <button className="btn" onClick={onCancel}>Cancel Quiz</button>
          </div>
        </div>
      ) : (
        <div>No questions available.</div>
      )}

      <div className="sidebar">
        <h4>Questions</h4>
        <div className="q-grid">
          {questions.map((q, i) => (
            <button
              key={q.id}
              className={`q-badge ${answers[q.id] ? "answered" : ""} ${i === index ? "current" : ""}`}
              onClick={() => setIndex(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
