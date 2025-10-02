import React from "react";

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="card">
      <img src={product.imageUrl} alt={product.name} className="card-img" />
      <div className="card-body">
        <h3>{product.name}</h3>
        <div className="price">${product.price.toFixed(2)}</div>
        <button className="btn" onClick={onAdd}>Add to Cart</button>
      </div>
    </div>
  );
}
