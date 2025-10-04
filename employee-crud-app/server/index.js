// index.js - Express server with CRUD endpoints
const express = require("express");
const cors = require("cors");
const { run, all, get, db } = require("./db");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 4002;
const app = express();

const allowedOrigin = "https://ase-challenge-k78l.vercel.app";

app.use(cors({
  origin: allowedOrigin,
  credentials: true, // if you're using cookies or auth headers
}));

app.use(express.json());

// Ensure schema exists on start
const schemaPath = path.join(__dirname, "schema.sql");
if (fs.existsSync(schemaPath)) {
  const schema = fs.readFileSync(schemaPath, "utf8");
  db.exec(schema, (err) => {
    if (err) console.error("Failed to initialize schema:", err);
  });
}

/**
 * Validation helpers
 */
function isValidEmail(email) {
  // simple RFC-light check
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * GET /api/employees
 * Returns list of all employees
 */
app.get("/api/employees", async (req, res) => {
  try {
    const rows = await all("SELECT id, name, email, position FROM employees ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

/**
 * GET /api/employees/:id
 * Return single employee
 */
app.get("/api/employees/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "invalid id" });
  try {
    const emp = await get("SELECT id, name, email, position FROM employees WHERE id = ?", [id]);
    if (!emp) return res.status(404).json({ error: "not found" });
    res.json(emp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

/**
 * POST /api/employees
 * Body: { name, email, position }
 */
app.post("/api/employees", async (req, res) => {
  const { name, email, position } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: "name and email required" });
  if (!isValidEmail(email)) return res.status(400).json({ error: "invalid email" });

  try {
    const result = await run(
      "INSERT INTO employees (name, email, position) VALUES (?, ?, ?)",
      [name, email, position || ""]
    );
    const created = await get("SELECT id, name, email, position FROM employees WHERE id = ?", [result.lastID]);
    res.status(201).json(created);
  } catch (err) {
    if (err && err.message && err.message.includes("UNIQUE constraint failed")) {
      return res.status(409).json({ error: "email already exists" });
    }
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

/**
 * PUT /api/employees/:id
 * Body: { name, email, position }
 */
app.put("/api/employees/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "invalid id" });

  const { name, email, position } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: "name and email required" });
  if (!isValidEmail(email)) return res.status(400).json({ error: "invalid email" });

  try {
    // Ensure employee exists
    const existing = await get("SELECT id FROM employees WHERE id = ?", [id]);
    if (!existing) return res.status(404).json({ error: "not found" });

    // Update
    await run("UPDATE employees SET name = ?, email = ?, position = ? WHERE id = ?", [name, email, position || "", id]);
    const updated = await get("SELECT id, name, email, position FROM employees WHERE id = ?", [id]);
    res.json(updated);
  } catch (err) {
    if (err && err.message && err.message.includes("UNIQUE constraint failed")) {
      return res.status(409).json({ error: "email already exists" });
    }
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

/**
 * DELETE /api/employees/:id
 */
app.delete("/api/employees/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "invalid id" });
  try {
    const existing = await get("SELECT id FROM employees WHERE id = ?", [id]);
    if (!existing) return res.status(404).json({ error: "not found" });
    await run("DELETE FROM employees WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db error" });
  }
});

/**
 * Health
 */
app.get("/", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Employee CRUD server listening on http://localhost:${PORT}`);
});
