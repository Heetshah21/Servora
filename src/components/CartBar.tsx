"use client";

import { useEffect, useState } from "react";
import { getCartCount, getCartTotal } from "@/lib/cart";
import Link from "next/link";
import { useIsMobile } from "@/lib/useIsMobile";

export default function CartBar({ restaurant  }: { restaurant : string }) {
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const updateCart = () => {
      setCount(getCartCount());
      setTotal(getCartTotal());
    };

    updateCart();

    window.addEventListener("cartUpdated", updateCart);

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);

  if (count === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: isMobile ? "0px" : "12px",
        left: isMobile ? "0px" : "12px",
        right: isMobile ? "0px" : "12px",
        background: "rgba(255,255,255,0.65)",
        color: "#111827",
        padding: isMobile ? "14px 16px" : "14px 16px",
        paddingBottom: isMobile ? "calc(14px + env(safe-area-inset-bottom, 0px))" : "14px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: isMobile ? "0px" : "12px",
        border: isMobile ? "none" : "1px solid rgba(229,231,235,0.9)",
        borderTop: isMobile ? "1px solid rgba(229,231,235,0.9)" : undefined,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: "0 -2px 20px rgba(0,0,0,0.08)",
        boxSizing: "border-box",
        zIndex: 50,
        gap: "12px",
      }}
    >
      <span style={{ color: "#374151", fontSize: isMobile ? "14px" : "15px", fontWeight: 600, whiteSpace: "nowrap" }}>
        {count} {count === 1 ? "item" : "items"} • ₹{total}
      </span>

      <Link
        href={`/r/${restaurant}/cart`}
        style={{
          background: "#111827",
          color: "white",
          padding: isMobile ? "12px 0" : "12px 18px",
          borderRadius: "12px",
          textDecoration: "none",
          border: "1px solid #111827",
          fontSize: isMobile ? "15px" : "15px",
          fontWeight: 700,
          boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
          flex: isMobile ? 1 : undefined,
          textAlign: "center",
          display: "block",
        }}
      >
        View Cart
      </Link>
    </div>
  );
}