import React, { useEffect, useState } from "react";
import { api } from "./services/api";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeForm from "./components/EmployeeForm";
import EditModal from "./components/EditModal";

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null); // employee obj to edit
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', message }

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
    setLoading(true);
    setError(null);
    try {
      const list = await api.listEmployees();
      setEmployees(list);
    } catch (err) {
      console.error(err);
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  }

  function showMessage(type, message) {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3500);
  }

  // create
  async function handleCreate(data) {
    try {
      const created = await api.createEmployee(data);
      // prepend to list (server returns created)
      setEmployees(prev => [created, ...prev]);
      showMessage("success", "Employee added");
    } catch (err) {
      console.error(err);
      if (err.status === 409) showMessage("error", "Email already exists");
      else showMessage("error", err.message || "Failed to add");
      throw err; // rethrow so form can stop spinner if needed
    }
  }

  // edit
  function openEdit(emp) {
    setEditing(emp);
  }

  async function handleUpdate(id, data) {
    try {
      const updated = await api.updateEmployee(id, data);
      setEmployees(prev => prev.map(e => (e.id === updated.id ? updated : e)));
      setEditing(null);
      showMessage("success", "Employee updated");
    } catch (err) {
      console.error(err);
      if (err.status === 409) showMessage("error", "Email already exists");
      else showMessage("error", err.message || "Failed to update");
      throw err;
    }
  }

  // delete (confirm)
  async function handleDelete(emp) {
    const ok = window.confirm(`Delete ${emp.name}?`);
    if (!ok) return;
    try {
      await api.deleteEmployee(emp.id);
      setEmployees(prev => prev.filter(e => e.id !== emp.id));
      showMessage("success", "Employee deleted");
    } catch (err) {
      console.error(err);
      showMessage("error", "Failed to delete");
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Employee Manager</h1>
      </header>

      <main>
        <section className="layout">
          <div className="left">
            <h2>Add Employee</h2>
            <EmployeeForm onSubmit={handleCreate} />
          </div>

          <div className="right">
            <div className="toolbar">
              <input
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search"
              />
              <button className="btn" onClick={fetchEmployees}>Refresh</button>
            </div>

            <div style={{ marginTop: 12 }}>
              {feedback && <div className={`notice ${feedback.type}`}>{feedback.message}</div>}
              {error && <div className="notice error">{error}</div>}
            </div>

            <div style={{ marginTop: 12 }}>
              {loading ? (
                <div className="muted">Loading employees…</div>
              ) : (
                <EmployeeTable
                  employees={employees}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  filter={search}
                />
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">Backend: <code>http://localhost:4002</code></footer>

      <EditModal open={!!editing} onClose={() => setEditing(null)} title="Edit Employee">
        {editing && (
          <EmployeeForm
            initial={editing}
            submitLabel="Save Changes"
            onSubmit={(data) => handleUpdate(editing.id, data)}
          />
        )}
      </EditModal>
    </div>
  );
}
