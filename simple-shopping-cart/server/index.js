// index.js - Express server
const express = require("express");
const cors = require("cors");
const products = require("./products");

const app = express();
const PORT = process.env.PORT || 4000;
const allowedOrigin = "https://ase-challenge-gv6o.vercel.app";

app.use(cors({
  origin: allowedOrigin,
  credentials: true, // if you're using cookies or auth headers
}));

app.use(express.json());

// GET /products - returns the hardcoded list
app.get("/products", (req, res) => {
  res.json(products);
});

// POST /checkout - receives cart data, logs it, returns success
// Expected body: { items: [{ id: "p1", quantity: 2 }, ...] }
app.post("/checkout", (req, res) => {
  const { items } = req.body || {};
  if (!Array.isArray(items)) {
    return res.status(400).json({ success: false, message: "items must be an array" });
  }

  // Enhance incoming items with product details (name, price) if possible
  const detailedItems = items.map(it => {
    const product = products.find(p => p.id === it.id);
    return {
      id: it.id,
      quantity: Number(it.quantity) || 0,
      name: product ? product.name : "Unknown product",
      price: product ? product.price : 0
    };
  });

  // Log to console as the "order"
  console.log("=== NEW ORDER ===");
  console.log(JSON.stringify({ createdAt: new Date().toISOString(), items: detailedItems }, null, 2));
  console.log("=================");

  // Respond success
  res.json({ success: true, message: "Order received" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
