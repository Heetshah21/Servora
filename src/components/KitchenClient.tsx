"use client";

import { useEffect, useState } from "react";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
};

type OrderStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

type Order = {
  id: string;
  orderCode: string;
  status: OrderStatus;
  placedAt: string;
  items: OrderItem[];
};

interface Props {
  initialOrders: Order[];
  tenantId: string;
  restaurantId: string;
}

export default function KitchenClient({
  initialOrders,
  tenantId,
  restaurantId,
}: Props) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  // 🔁 Polling with stale-data protection
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/orders/list?tenantId=${tenantId}&restaurantId=${restaurantId}`
        );
        const data: Order[] = await res.json();

        setOrders((prev) => {
          const updated = data.map((newOrder) => {
            const existing = prev.find((o) => o.id === newOrder.id);

            // ✅ Prevent flicker (keep optimistic state if ahead)
            if (existing && existing.status !== newOrder.status) {
              return existing;
            }

            return newOrder;
          });

          return updated;
        });
      } catch (err) {
        console.error("Polling failed:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [tenantId, restaurantId]);

  // ⚡ Optimistic update
  const updateStatus = async (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status } : o
      )
    );

    try {
      await fetch("/api/orders/update", {
        method: "POST",
        body: JSON.stringify({ orderId, status }),
      });
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const pending = orders.filter((o) => o.status === "PENDING");
  const confirmed = orders.filter((o) => o.status === "CONFIRMED");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "14px",
      }}
    >
      <Column title="Pending" orders={pending} updateStatus={updateStatus} />
      <Column title="Confirmed" orders={confirmed} updateStatus={updateStatus} />
    </div>
  );
}

function Column({
  title,
  orders,
  updateStatus,
}: {
  title: string;
  orders: Order[];
  updateStatus: (id: string, status: OrderStatus) => void;
}) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        background: "#fff",
        padding: "12px",
        minHeight: "220px",
      }}
    >
      <h2 style={{ margin: "0 0 10px", fontSize: "18px" }}>{title}</h2>

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #e5e7eb",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "10px",
          }}
        >
          <strong>#{order.orderCode}</strong>

          <div style={{ marginTop: "8px" }}>
            {order.items.map((item) => (
              <div key={item.id}>
                {item.quantity}x {item.name}
              </div>
            ))}
          </div>

          <div style={{ marginTop: "10px", display: "flex", gap: "6px" }}>
            {order.status === "PENDING" && (
              <>
                <button
                  onClick={() => updateStatus(order.id, "CONFIRMED")}
                  style={{
                    padding: "8px 12px",
                    background: "#111827",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Accept
                </button>

                <button
                  onClick={() => updateStatus(order.id, "CANCELLED")}
                  style={{
                    padding: "8px 12px",
                    background: "#fff",
                    color: "#111827",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Decline
                </button>
              </>
            )}

            {order.status === "CONFIRMED" && (
              <button
                onClick={() => updateStatus(order.id, "COMPLETED")}
                style={{
                  padding: "8px 12px",
                  background: "#16a34a",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Ready
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}