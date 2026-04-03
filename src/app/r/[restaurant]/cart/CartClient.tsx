"use client";

import { useEffect, useState } from "react";
import {
  getCart,
  updateQuantity,
  removeFromCart,
} from "@/lib/cart";
import { useIsMobile } from "@/lib/useIsMobile";

export default function CartClient({ restaurant }: { restaurant: string }) {
  const [cart, setCart] = useState<any[]>([]);
  const [orderNotes, setOrderNotes] = useState("");
  const [orderType, setOrderType] = useState("TAKEAWAY");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

  const loadCart = () => {
    setCart(getCart());
  };

  useEffect(() => {
    loadCart();
  }, []);

  const changeQty = (id: string, qty: number, isJain?: boolean) => {
    if (qty <= 0) {
      removeFromCart(id, isJain);
    } else {
      updateQuantity(id, qty, isJain);
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

  const tableNumber =
    typeof window !== "undefined"
      ? localStorage.getItem("servora_table")
      : null;

  const isDineIn = tableNumber ? true : false;

  const placeOrder = async () => {
    if (loading) return;

    if (!isDineIn) {
      if (!customerName || !customerPhone) {
        alert("Please enter name and phone number");
        return;
      }

      if (orderType === "DELIVERY" && !deliveryAddress) {
        alert("Please enter delivery address");
        return;
      }
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantSlug: restaurant,
          items: cart,
          orderNotes: orderNotes,
          tableNumber: tableNumber,
          orderType: isDineIn ? "IN_STORE" : orderType,
          customerName: customerName,
          customerPhone: customerPhone,
          deliveryAddress: deliveryAddress,
        }),
      });

      const data = await res.json();

      if (data.orderId) {
        localStorage.removeItem("servora_cart");
        localStorage.removeItem("servora_table");
        window.location.href = `/r/${restaurant}/order/${data.orderId}`;
      } else {
        alert("Order creation failed");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
      setLoading(false);
    }
  };

  const qtyBtnStyle: React.CSSProperties = {
    width: isMobile ? "40px" : "34px",
    height: isMobile ? "40px" : "34px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    background: "#f9fafb",
    cursor: "pointer",
    fontSize: isMobile ? "18px" : "16px",
    color: "#111827",
    fontWeight: 700,
  };

  return (
    <div
      style={{
        padding: isMobile ? "16px 12px" : "20px",
        maxWidth: "720px",
        margin: "0 auto",
        paddingBottom: "120px",
        background: "#f5f6f8",
        borderRadius: "12px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
      }}
    >
      <a
        href={`/r/${restaurant}/menu`}
        style={{
          display: "inline-block",
          marginBottom: "20px",
          textDecoration: "none",
          color: "#111827",
          fontWeight: 500,
        }}
      >
        ← Back to Menu
      </a>

      <h1 style={{ marginBottom: "20px", color: "#111827" }}>
        Your Cart
      </h1>

      {cart.length === 0 && <p>Cart is empty</p>}

      {cart.map((item) => (
        <div
          key={item.id + (item.isJain ? "-jain" : "")}
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "10px",
            border: "1px solid #e5e7eb",
            padding: "14px",
            borderRadius: "12px",
            marginBottom: "12px",
            background: "white",
          }}
        >
          <div style={{ flex: 1 }}>
            <strong>{item.name}</strong>
            <p>₹{item.price}</p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <button
                onClick={() =>
                  changeQty(item.id, item.quantity - 1, item.isJain)
                }
                type="button"
                style={qtyBtnStyle}
              >
                -
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() =>
                  changeQty(item.id, item.quantity + 1, item.isJain)
                }
                type="button"
                style={qtyBtnStyle}
              >
                +
              </button>
            </div>
          </div>
        </div>
      ))}

      {cart.length > 0 && (
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "16px",
            background: "#fff",
            marginTop: "8px",
          }}
        >
          <h2>Total: ₹{getTotal()}</h2>

          <textarea
            placeholder="Special instructions"
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "12px",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          />

          {!isDineIn && (
            <>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  marginTop: "10px",
                }}
              >
                <option value="TAKEAWAY">Takeaway</option>
                <option value="DELIVERY">Delivery</option>
              </select>

              <input
                placeholder="Your Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "10px",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                }}
              />

              <input
                placeholder="Phone Number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "10px",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                }}
              />

              {orderType === "DELIVERY" && (
                <textarea
                  placeholder="Delivery Address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "10px",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                  }}
                />
              )}
            </>
          )}

          <button
            onClick={placeOrder}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#6b7280" : "#111827",
              color: "white",
              border: "none",
              borderRadius: "12px",
              marginTop: "18px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      )}
    </div>
  );
}