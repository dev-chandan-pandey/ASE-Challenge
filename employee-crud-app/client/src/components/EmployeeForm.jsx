import React, { useState } from "react";

/**
 * Props:
 * - onSubmit({ name, email, position }) -> promise
 * - initial (optional) { name, email, position }
 * - submitLabel (optional)
 */
export default function EmployeeForm({ onSubmit, initial = null, submitLabel = "Add Employee" }) {
  const [name, setName] = useState(initial ? initial.name : "");
  const [email, setEmail] = useState(initial ? initial.email : "");
  const [position, setPosition] = useState(initial ? initial.position : "");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    try {
      await onSubmit({ name: name.trim(), email: email.trim(), position: position.trim() });
      // clear form only if adding (not editing)
      if (!initial) {
        setName("");
        setEmail("");
        setPosition("");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        {errors.name && <div className="field-error">{errors.name}</div>}
      </div>

      <div className="form-row">
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        {errors.email && <div className="field-error">{errors.email}</div>}
      </div>

      <div className="form-row">
        <label>Position</label>
        <input value={position} onChange={(e) => setPosition(e.target.value)} />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
