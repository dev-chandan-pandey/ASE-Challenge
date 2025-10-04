# 👨‍💼 Employee CRUD App

A full-stack **CRUD application** to manage employees with name, email, and position.

- **Backend**: Node.js + Express + SQLite
- **Frontend**: React (Vite) + Fetch API
- **Containerization**: Docker + docker-compose

---

## 📂 Project Structure

```
employee-crud/
├─ server/ # Backend - Express + SQLite
│ ├─ index.js
│ ├─ db.js
│ ├─ routes.js
│ ├─ tests/ # Backend tests
│ └─ Dockerfile
├─ client/ # Frontend - React + Vite
│ ├─ src/
│ ├─ vite.config.js
│ ├─ package.json
│ ├─ Dockerfile
│ └─ nginx.conf
└─ docker-compose.yml
```


---

## 🚀 Getting Started

### 1. Run locally (without Docker)

Backend:
`
cd server
npm install
npm start
`
# runs at http://localhost:4002


Frontend:
`
cd client
npm install
npm run dev
`
# runs at http://localhost:5173

2. Run with Docker

Build & start both frontend and backend:

`
docker-compose up --build

`

Frontend → http://localhost:5173

Backend → http://localhost:4002/api/employees

🔑 API Endpoints
GET /api/employees

Get all employees.

POST /api/employees

Create a new employee.
Body:
`
{
  "name": "Alice",
  "email": "alice@example.com",
  "position": "Manager"
}
`

PUT /api/employees/:id

Update an employee.

DELETE /api/employees/:id

Delete an employee.


✨ Features

List employees in a table

Add new employees via form

Edit employees in a modal

Delete employees with confirmation

Search/filter employees by name

Frontend form validation

Backend email uniqueness check

Fully containerized with Docker

🧪 Tests

Backend tests included for:

GET /api/employees

POST /api/employees

PUT /api/employees/:id

DELETE /api/employees/:id

Run tests:
`
cd server
npm test
`

📸 Screenshots (placeholders)

👉 Will be replaced with actual screenshots of the running app.

Employee Table View


Add Employee Form


Edit Employee Modal

📌 Evaluation Checklist

 CRUD flow works end-to-end

 State updates handled on frontend

 Clean REST API design

 Bonus: search/filter

 Bonus: validation

 Bonus: backend + frontend tests
 