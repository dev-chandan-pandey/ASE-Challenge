📘 Full-Stack Assignment Projects

This repository contains three full-stack applications built as part of job assignment challenges.
Each project has a backend (Node.js + Express + SQLite) and a frontend (React + Vite), deployed separately.

🚀 Live Demo Links
Shopping Cart

Backend: `https://ase-challenge-2.onrender.com`

Frontend: `https://ase-challenge-gv6o.vercel.app`

Quiz App

Backend:` https://ase-challenge-crjc.onrender.com`

Frontend: `https://ase-challenge-omega.vercel.app`

Employee CRUD

Backend:` https://ase-challenge-3.onrender.com`

Frontend: `https://ase-challenge-k78l.vercel.app`

🛠 Tech Stack

Backend: Node.js, Express, SQLite3

Frontend: React, Vite, TailwindCSS

Deployment: Render (backend), Vercel (frontend)

Testing (Bonus): Jest + Supertest

📂 Project Details
🛒 Shopping Cart

Features:

View products from API

Add to cart

View cart with quantities and total

Checkout (sends order to backend)

Bonus: Cart persistence with localStorage

Backend API Endpoints:

GET /api/products → fetch all products

POST /api/checkout → log order & return success

📝 Online Quiz App

Features:

Start quiz

Navigate questions (Next / Previous)

Submit answers → get score

Final results page shows score

Bonus: Timer + Show correct/wrong answers

Backend API Endpoints:

GET /api/quiz/:id → fetch quiz questions (no answers)

POST /api/quiz/:id/submit → submit answers & calculate score

👨‍💼 Employee CRUD

Features:

View all employees

Add employee via form

Edit employee (modal or page)

Delete employee

Bonus: Search/filter employees, form validation

Backend API Endpoints:

GET /api/employees → list employees

POST /api/employees → add employee

PUT /api/employees/:id → update employee

DELETE /api/employees/:id → delete employee

💻 Local Setup

Clone the repo and run each project separately (backend + frontend).

Backend (for each project)
cd project-backend
npm install
npm start


Runs at: http://localhost:5000

Frontend (for each project)
cd project-frontend
npm install
npm run dev


Runs at: http://localhost:5173

✅ Tests (Bonus)

Run backend tests:

npm test


Covers:

Shopping Cart → /api/products

Quiz App → scoring logic

Employee CRUD → all CRUD endpoints

📦 Deployment

Backend: Deployed on Render with SQLite seeding (so demo data is always available).

Frontend: Deployed on Vercel and connected to backend API.

✨ With this setup, each project is fully functional, deployed, and tested — meeting all assignment requirements.