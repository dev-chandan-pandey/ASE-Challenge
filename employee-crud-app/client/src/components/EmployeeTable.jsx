import React from "react";

/**
 * Props:
 * - employees: array
 * - onEdit(employee)
 * - onDelete(employee)
 * - onSelect(id) optional
 */
export default function EmployeeTable({ employees = [], onEdit, onDelete, filter = "" }) {
  const filtered = employees.filter(e => e.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="table-card">
      <table className="emp-table">
        <thead>
          <tr>
            <th style={{ width: 40 }}>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Position</th>
            <th style={{ width: 160 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="5" className="empty">No employees found</td>
            </tr>
          ) : (
            filtered.map((e, i) => (
              <tr key={e.id}>
                <td>{i + 1}</td>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td>{e.position}</td>
                <td>
                  <button className="btn small" onClick={() => onEdit(e)}>Edit</button>
                  <button className="btn small danger" onClick={() => onDelete(e)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
