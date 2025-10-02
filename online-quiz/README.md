📝 Assignment 2 – Online Quiz Application
Project Overview

A full-stack quiz application where users can attempt a quiz, navigate through questions, and view their final score.

📂 Project Structure
```
quiz-app/
├─ server/   # Backend - Express + SQLite
│  ├─ db.js
│  ├─ seed.js
│  ├─ index.js
│  └─ __tests__/
└─ client/   # Frontend - React + Vite
   ├─ src/
   ├─ index.html
   └─ vite.config.js

```
🚀 Features

Backend

SQLite database with quiz questions.

GET /questions → returns quiz questions (without correct answers).

POST /submit → accepts answers, calculates score, returns results.

Jest test for scoring logic.

Frontend

Start screen → begin quiz.

Question view with multiple-choice options.

Navigation: "Next" and "Previous".

Submit → sends answers to backend.

Result screen shows score.

Bonus

Countdown timer for quiz.

Detailed results → correct vs wrong answers.

🛠️ Installation & Running
Backend

    `
cd server
npm install
npm run seed   
npm start    
    `

    Run backend tests

`
 npm test
`


Frontend

`
cd ../client
npm install
npm run dev  
`

🐳 Docker Setup (Optional)

`
docker-compose up --build
`
Backend → http://localhost:4000

Frontend → http://localhost:5173
✅ Usage

Open frontend in browser.

Start the quiz → answer each question.

Navigate using Next/Previous.

Submit at the end → see score + answers review.