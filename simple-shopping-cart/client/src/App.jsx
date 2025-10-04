import React, { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import CartModal from "./components/CartModal";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://ase-challenge-1.onrender.com";

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("ssc_cart");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    fetch(`${BACKEND}/products`)
      .then(r => r.json())
      .then(setProducts)
      .catch(err => {
        console.error("Failed to fetch products:", err);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("ssc_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (productId) => {
    setCart(prev => {
      const current = prev[productId] || 0;
      return { ...prev, [productId]: current + 1 };
    });
  };

  const setQuantity = (productId, qty) => {
    setCart(prev => {
      const next = { ...prev };
      if (qty <= 0) {
        delete next[productId];
      } else {
        next[productId] = qty;
      }
      return next;
    });
  };

  const clearCart = () => setCart({});

  const cartItemsDetailed = Object.entries(cart).map(([id, quantity]) => {
    const prod = products.find(p => p.id === id);
    return {
      id,
      quantity,
      name: prod ? prod.name : "Unknown",
      price: prod ? prod.price : 0,
      imageUrl: prod ? prod.imageUrl : ""
    };
  });

  const total = cartItemsDetailed.reduce((s, it) => s + it.price * it.quantity, 0);

  const checkout = async () => {
    if (cartItemsDetailed.length === 0) {
      alert("Cart is empty");
      return;
    }
    try {
      const res = await fetch(`${BACKEND}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItemsDetailed.map(it => ({ id: it.id, quantity: it.quantity })) })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Order placed successfully!");
        clearCart();
        setIsCartOpen(false);
      } else {
        alert("Checkout failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to reach server during checkout.");
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Simple Shopping Cart</h1>
        <button className="cart-button" onClick={() => setIsCartOpen(true)}>
          Cart ({Object.values(cart).reduce((a, b) => a + b, 0)})
        </button>
      </header>

      <main>
        <div className="product-grid">
          {products.map(p => (
            <ProductCard key={p.id} product={p} onAdd={() => addToCart(p.id)} />
          ))}
        </div>
      </main>

      <CartModal
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItemsDetailed}
        total={total}
        onSetQuantity={setQuantity}
        onCheckout={checkout}
        onClear={clearCart}
      />

      <footer className="footer">Made for assignment — demo checkout logs orders on server console.</footer>
    </div>
  );
}
