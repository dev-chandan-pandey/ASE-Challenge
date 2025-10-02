
```
simple-shopping-cart/
├─ server/   # Backend - Express API
│  ├─ index.js
│  ├─ products.js
│  └─ __tests__/
└─ client/   # Frontend - React + Vite
   ├─ src/
   ├─ index.html
   └─ vite.config.js

```

🚀 Features

Backend

GET /products → returns hardcoded product list.

POST /checkout → logs order and returns success.

Jest + Supertest test for endpoints.

Frontend

Product grid with "Add to Cart".

Cart modal with items, quantities, total price.

Checkout button sends order to backend.

Cart persists with localStorage.

Bonus

Quantity change inside cart.

Clear cart option.

🛠️ Installation & Running
Backend

`
cd server
npm install
npm start   # runs backend on http://localhost:4000

`
Run backend tests

`
npm test
`
Frontend
`
cd ../client
npm install
npm run dev  http://localhost:5173
`

🐳 Docker Setup (Optional)

`
docker-compose up --build
`
Backend → http://localhost:4000

Frontend → http://localhost:5173

✅ Usage

Open frontend in browser.

Browse products → Add to Cart.

View Cart → change quantities → Checkout.

Order logs appear in backend console.