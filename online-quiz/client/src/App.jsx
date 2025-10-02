import React, { useState } from "react";
import StartPage from "./pages/StartPage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";

export default function App() {
  // pages: start, quiz, result
  const [page, setPage] = useState("start");
  const [quizId, setQuizId] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // { questionId: "a" }
  const [result, setResult] = useState(null);

  return (
    <div className="container">
      {page === "start" && (
        <StartPage
          onStart={ async (selectedQuizId) => {
  try {
    const res = await fetch(`http://localhost:4001/quiz/${selectedQuizId}/questions`);
    if (!res.ok) throw new Error(`Failed to fetch quiz questions: ${res.status}`);
    const data = await res.json();
    console.log("Fetched quiz questions:", data);
    if (!data.questions || !data.questions.length)
      alert("No questions found for this quiz.");
    setQuestions(data.questions || []);
    setQuizId(selectedQuizId);
    setAnswers({});
    setPage("quiz");
  } catch (err) {
    alert("Failed to load quiz");
    console.error(err);
  }
}}
        />
      )}

      {page === "quiz" && (
        <QuizPage
          questions={questions}
          answers={answers}
          setAnswers={setAnswers}
          onSubmit={async (answersObj) => {
            // transform to array
            const payload = { answers: Object.entries(answersObj).map(([qid, ans]) => ({ questionId: Number(qid), answer: ans })) };
            try {
              const res = await fetch(`http://localhost:4001/quiz/${quizId}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
              });
              const data = await res.json();
              setResult(data);
              setPage("result");
            } catch (err) {
              alert("Failed to submit answers");
              console.error(err);
            }
          }}
          onCancel={() => setPage("start")}
        />
      )}

      {page === "result" && <ResultPage result={result} onRetry={() => setPage("start")} />}
    </div>
  );
}
