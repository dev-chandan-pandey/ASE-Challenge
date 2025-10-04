// simple API wrapper
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4002";

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, options);
  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await res.json() : null;
  if (!res.ok) {
    const err = new Error(body && body.error ? body.error : `Request failed: ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

export const api = {
  listEmployees: () => request("/api/employees"),
  createEmployee: (data) =>
    request("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }),
  updateEmployee: (id, data) =>
    request(`/api/employees/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }),
  deleteEmployee: (id) =>
    request(`/api/employees/${id}`, {
      method: "DELETE"
    }),
  getEmployee: (id) => request(`/api/employees/${id}`)
};
