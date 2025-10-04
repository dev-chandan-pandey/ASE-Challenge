import React from "react";

/**
 * Simple modal. children is the form
 * Props:
 * - open (bool)
 * - onClose()
 * - title (string)
 * - children
 */
export default function EditModal({ open, onClose, title = "Edit", children }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
