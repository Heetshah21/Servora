"use client";

import { useEffect, useState } from "react";
import {
  getCart,
  updateQuantity,
  removeFromCart,
} from "@/lib/cart";

export default function CartClient({ tenant }: { tenant: string }) {
  const [cart, setCart] = useState<any[]>([]);

  const loadCart = () => {
    setCart(getCart());
  };

  useEffect(() => {
    loadCart();
  }, []);

  const changeQty = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, qty);
    }

    loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const getTotal = () => {
    return cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <a
  href={`/t/${tenant}/menu`}
  style={{
    display: "inline-block",
    marginBottom: "20px",
    textDecoration: "none",
    color: "#111",
  }}
>
  ← Back to Menu
</a>
      <h1 style={{ marginBottom: "20px" }}>Your Cart</h1>
      
      {cart.length === 0 && <p>Cart is empty</p>}

      {cart.map((item) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            gap: "10px",
            border: "1px solid #eee",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "10px",
            background: "white",
          }}
        >
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              style={{
                width: "60px",
                height: "60px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />
          )}

          <div style={{ flex: 1 }}>
            <strong>{item.name}</strong>
            <p>₹{item.price}</p>

            <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
              <button onClick={() => changeQty(item.id, item.quantity - 1)}>
                -
              </button>

              <span>{item.quantity}</span>

              <button onClick={() => changeQty(item.id, item.quantity + 1)}>
                +
              </button>
            </div>
          </div>
        </div>
      ))}

      {cart.length > 0 && (
        <>
          <h2>Total: ₹{getTotal()}</h2>

          <button
          onClick={async () => {
            const res = await fetch("/api/orders/place", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                tenantSlug: tenant,
                items: cart,
              }),
            });
          
            const data = await res.json();
            console.log("ORDER RESPONSE:", data);
          
            if (data.orderId) {
              localStorage.removeItem("servora_cart");
              window.location.href = `/t/${tenant}/order/${data.orderId}`;
            } else {
              alert("Order creation failed");
            }
          }}
          style={{
            width: "100%",
            padding: "14px",
            background: "#111",
            color: "white",
            border: "none",
            borderRadius: "8px",
            marginTop: "20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Place Order
        </button>
        </>
      )}
    </div>
  );
}