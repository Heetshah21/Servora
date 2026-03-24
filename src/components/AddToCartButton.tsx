"use client";

import { addToCart } from "@/lib/cart";

export default function AddToCartButton({ item }: any) {
  return (
    <button
    type="button"
      onClick={() => {
        addToCart({
          id: item.id,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl || undefined,
          quantity: 1,
        });
        window.dispatchEvent(new Event("cartUpdated"));
      }}
      style={{
        height: "35px",
        alignSelf: "center",
        background: "#111",
        color: "white",
        border: "none",
        borderRadius: "6px",
        padding: "0 10px",
        cursor: "pointer",
      }}
    >
      Add
    </button>
  );
}