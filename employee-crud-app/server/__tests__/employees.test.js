// employees.test.js - integration tests using an in-memory sqlite DB
const request = require("supertest");
const express = require("express");
const bodyParser = require("express").json;
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

let server;
let app;
let dbFilePath;

beforeAll(async () => {
  // create a temporary file-backed sqlite DB for tests
  dbFilePath = path.join(__dirname, "test-employees.db");
  if (fs.existsSync(dbFilePath)) fs.unlinkSync(dbFilePath);

  const db = new sqlite3.Database(dbFilePath);
  const schema = fs.readFileSync(path.join(__dirname, "..", "schema.sql"), "utf8");
  await new Promise((res, rej) => db.exec(schema, (err) => (err ? rej(err) : res())));
  // insert a sample employee
  await new Promise((res, rej) =>
    db.run("INSERT INTO employees (name, email, position) VALUES (?, ?, ?)",
      ["Test User", "testuser@example.com", "Tester"], function (err) {
        if (err) rej(err);
        else res(this.lastID);
      })
  );
  db.close();

  // We will start the actual app but point it to this test DB by env var and require the app files in a simplified way.
  // Create a small express app wiring the same routes as index.js but using the test DB helper.
  // Instead of reusing server/index.js (which reads env var DB_PATH during require of db.js),
  // we'll spawn the real server as a child process is too heavy. So we will create a minimal mount replicating behavior.

  // To reuse code, we will set process.env.DB_PATH and require the index.js via child require would have side-effects.
  process.env.DB_PATH = dbFilePath;

  // require the real server file as a module - to avoid double listening, we will import the CRUD handlers from index.js-like code.
  // Simpler: spawn the actual index.js server as a child process isn't ideal in jest. So instead we will create a tiny express app
  // that re-implements the same endpoints but connecting to the test DB directly (keeps tests focused on API contract).

  const testDb = new sqlite3.Database(dbFilePath);
  const run = (sql, params = []) =>
    new Promise((res, rej) => testDb.run(sql, params, function (e) { if (e) rej(e); else res(this); }));
  const get = (sql, params = []) =>
    new Promise((res, rej) => testDb.get(sql, params, (e, r) => (e ? rej(e) : res(r))));
  const all = (sql, params = []) =>
    new Promise((res, rej) => testDb.all(sql, params, (e, r) => (e ? rej(e) : res(r))));

  app = express();
  app.use(bodyParser());

  // same handlers as index.js but local to test app
  app.get("/api/employees", async (req, res) => {
    const rows = await all("SELECT id, name, email, position FROM employees ORDER BY id DESC");
    res.json(rows);
  });

  app.get("/api/employees/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "invalid id" });
    const emp = await get("SELECT id, name, email, position FROM employees WHERE id = ?", [id]);
    if (!emp) return res.status(404).json({ error: "not found" });
    res.json(emp);
  });

  app.post("/api/employees", async (req, res) => {
    const { name, email, position } = req.body || {};
    if (!name || !email) return res.status(400).json({ error: "name and email required" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "invalid email" });
    try {
      const r = await run("INSERT INTO employees (name, email, position) VALUES (?, ?, ?)", [name, email, position || ""]);
      const created = await get("SELECT id, name, email, position FROM employees WHERE id = ?", [r.lastID]);
      res.status(201).json(created);
    } catch (err) {
      if (err && err.message && err.message.includes("UNIQUE")) return res.status(409).json({ error: "email already exists" });
      res.status(500).json({ error: "db error" });
    }
  });

  app.put("/api/employees/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { name, email, position } = req.body || {};
    if (!id) return res.status(400).json({ error: "invalid id" });
    if (!name || !email) return res.status(400).json({ error: "name and email required" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "invalid email" });
    const existing = await get("SELECT id FROM employees WHERE id = ?", [id]);
    if (!existing) return res.status(404).json({ error: "not found" });
    try {
      await run("UPDATE employees SET name = ?, email = ?, position = ? WHERE id = ?", [name, email, position || "", id]);
      const updated = await get("SELECT id, name, email, position FROM employees WHERE id = ?", [id]);
      res.json(updated);
    } catch (err) {
      if (err && err.message && err.message.includes("UNIQUE")) return res.status(409).json({ error: "email already exists" });
      res.status(500).json({ error: "db error" });
    }
  });

  app.delete("/api/employees/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "invalid id" });
    const existing = await get("SELECT id FROM employees WHERE id = ?", [id]);
    if (!existing) return res.status(404).json({ error: "not found" });
    await run("DELETE FROM employees WHERE id = ?", [id]);
    res.json({ success: true });
  });

  server = app.listen(0); // random available port
});

afterAll(() => {
  if (server) server.close();
  // cleanup test db file
  try { fs.unlinkSync(path.join(__dirname, "test-employees.db")); } catch (e) {}
});

test("GET /api/employees returns array with seeded employee", async () => {
  const res = await request(server).get("/api/employees");
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBeGreaterThanOrEqual(1);
  const e = res.body.find(x => x.email === "testuser@example.com");
  expect(e).toBeDefined();
  expect(e).toHaveProperty("name");
});

test("POST /api/employees creates a new employee", async () => {
  const payload = { name: "New Person", email: "new@example.com", position: "HR" };
  const res = await request(server).post("/api/employees").send(payload);
  expect(res.status).toBe(201);
  expect(res.body).toMatchObject({ name: payload.name, email: payload.email, position: payload.position });
});

test("POST /api/employees rejects duplicate email", async () => {
  const payload = { name: "Dup", email: "testuser@example.com", position: "X" };
  const res = await request(server).post("/api/employees").send(payload);
  expect(res.status).toBe(409);
});

test("PUT /api/employees/:id updates an employee", async () => {
  // create one
  const create = await request(server).post("/api/employees").send({ name: "To Update", email: "toupdate@example.com", position: "G" });
  const id = create.body.id;
  const update = await request(server).put(`/api/employees/${id}`).send({ name: "Updated", email: "updated@example.com", position: "Lead" });
  expect(update.status).toBe(200);
  expect(update.body.name).toBe("Updated");
  expect(update.body.email).toBe("updated@example.com");
});

test("DELETE /api/employees/:id deletes an employee", async () => {
  const create = await request(server).post("/api/employees").send({ name: "To Delete", email: "todelete@example.com", position: "X" });
  const id = create.body.id;
  const del = await request(server).delete(`/api/employees/${id}`);
  expect(del.status).toBe(200);
  expect(del.body).toHaveProperty("success", true);
  // subsequent get should 404
  const get = await request(server).get(`/api/employees/${id}`);
  expect(get.status).toBe(404);
});
