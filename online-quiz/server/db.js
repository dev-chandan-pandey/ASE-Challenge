// db.js - SQLite helper
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
require("dotenv").config();
const fs = require("fs");

// Make sure `data/` directory exists
// const dataDir = path.join(__dirname, "data");
// if (!fs.existsSync(dataDir)) {
//   fs.mkdirSync(dataDir);
// }
// const DB_PATH = process.env.DB_PATH || path.join(__dirname,  "data","quiz.db");

// Always use one fixed DB file
// const DB_PATH = path.join(dataDir, "quiz.db");
// console.log("Using database:", DB_PATH);
const DB_PATH = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : path.join(__dirname, "data", "quiz.db");

if (!fs.existsSync(path.dirname(DB_PATH))) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

console.log("Using database:", DB_PATH);

const db = new sqlite3.Database(DB_PATH);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

module.exports = { db, run, all, get };
