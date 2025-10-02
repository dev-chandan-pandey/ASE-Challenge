import React from "react";

export default function CartModal({ open, onClose, items, total, onSetQuantity, onCheckout, onClear }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Your Cart</h2>
          <button className="close" onClick={onClose}>×</button>
        </div>

        {items.length === 0 ? (
          <div className="empty">Your cart is empty</div>
        ) : (
          <div className="cart-list">
            {items.map(it => (
              <div className="cart-item" key={it.id}>
                <img src={it.imageUrl} alt={it.name} />
                <div className="ci-info">
                  <div className="ci-name">{it.name}</div>
                  <div className="ci-price">${it.price.toFixed(2)}</div>
                </div>
                <div className="ci-qty">
                  <button onClick={() => onSetQuantity(it.id, it.quantity - 1)}>-</button>
                  <input
                    value={it.quantity}
                    onChange={(e) => {
                      const v = parseInt(e.target.value || "0", 10);
                      onSetQuantity(it.id, isNaN(v) ? 0 : v);
                    }}
                  />
                  <button onClick={() => onSetQuantity(it.id, it.quantity + 1)}>+</button>
                </div>
                <div className="ci-sub">${(it.price * it.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}

        <div className="modal-footer">
          <div className="total">Total: ${total.toFixed(2)}</div>
          <div className="actions">
            <button className="btn secondary" onClick={onClear}>Clear</button>
            <button className="btn" onClick={onCheckout}>Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
}
