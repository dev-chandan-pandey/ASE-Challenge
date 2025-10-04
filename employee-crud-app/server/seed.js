// seed.js - create schema and insert sample employees
const fs = require("fs");
const path = require("path");
const { db } = require("./db");

const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");

db.serialize(() => {
  db.exec(schema, (err) => {
    if (err) {
      console.error("Failed to create schema:", err);
      process.exit(1);
    }

    const stmt = db.prepare("INSERT OR IGNORE INTO employees (name, email, position) VALUES (?, ?, ?)");
    const sample = [
      ["Alice Johnson", "alice@example.com", "Product Manager"],
      ["Bob Singh", "bob@example.com", "Software Engineer"],
      ["Clara Lee", "clara@example.com", "Designer"]
    ];

    sample.forEach(s => stmt.run(s, (e) => { if (e) console.warn("seed insert warning:", e.message); }));
    stmt.finalize(() => {
      console.log("Seed complete.");
      process.exit(0);
    });
  });
});
