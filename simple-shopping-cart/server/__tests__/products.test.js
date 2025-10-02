const request = require("supertest");
const express = require("express");
const products = require("../products");

let app;
beforeAll(() => {
  app = express();
  app.use(express.json());
  app.get("/products", (req, res) => res.json(products));
});

test("GET /products returns array of products", async () => {
  const res = await request(app).get("/products");
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBeGreaterThanOrEqual(1);
  expect(res.body[0]).toHaveProperty("id");
  expect(res.body[0]).toHaveProperty("name");
  expect(res.body[0]).toHaveProperty("price");
});
