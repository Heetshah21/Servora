"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";
import AddToCartModal from "@/components/AddToCartModal";

export default function AddToCartButton({ item }: any) {
  const [showModal, setShowModal] = useState(false);

  const handleAddClick = () => {
    console.log("ITEM:", item);
    if (item.isJainAvailable) {
      setShowModal(true);
    } else {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl || undefined,
        quantity: 1,
        isJain: false,
        notes: "",
      });

      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleAddClick}
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

      {showModal && (
        <AddToCartModal
          item={item}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}