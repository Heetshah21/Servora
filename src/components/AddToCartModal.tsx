"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";

export default function AddToCartModal({
  item,
  onClose,
}: {
  item: any;
  onClose: () => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [isJain, setIsJain] = useState(false);
  const [notes, setNotes] = useState("");

  const handleAdd = () => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      quantity,
      isJain,
      notes,
    });

    window.dispatchEvent(new Event("cartUpdated"));
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          width: "300px",
        }}
      >
        <h2>{item.name}</h2>

        {item.isJainAvailable && (
          <>
            <p>Choose Variant:</p>
            <label>
              <input
                type="radio"
                checked={!isJain}
                onChange={() => setIsJain(false)}
              />
              Regular
            </label>

            <br />

            <label>
              <input
                type="radio"
                checked={isJain}
                onChange={() => setIsJain(true)}
              />
              Jain
            </label>
          </>
        )}

        <p style={{ marginTop: "10px" }}>Quantity:</p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setQuantity(quantity - 1)}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>

        <textarea
          placeholder="Item note (less spicy, no onion...)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{
            width: "100%",
            marginTop: "10px",
            padding: "6px",
          }}
        />

        <button
          onClick={handleAdd}
          style={{
            width: "100%",
            marginTop: "10px",
            padding: "10px",
            background: "#111",
            color: "white",
            border: "none",
            borderRadius: "6px",
          }}
        >
          Add To Cart
        </button>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            marginTop: "5px",
            padding: "10px",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}