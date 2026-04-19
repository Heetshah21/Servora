"use client";

import { useEffect, useState } from "react";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
};

type Order = {
  id: string;
  orderCode: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
};

interface Props {
  initialOrders: Order[];
  tenantId: string;
  restaurantId: string;
}

export default function OrdersClient({
  initialOrders,
  tenantId,
  restaurantId,
}: Props) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  // 🔁 Polling
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(
        `/api/orders/list?tenantId=${tenantId}&restaurantId=${restaurantId}&type=orders`
      );
      const data = await res.json();

      setOrders((prev) =>
        data.map((newOrder: Order) => {
          const existing = prev.find((o) => o.id === newOrder.id);

          if (existing && existing.status !== newOrder.status) {
            return existing;
          }

          return newOrder;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [tenantId, restaurantId]);

  // ⚡ Optimistic update
  const updateStatus = async (orderId: string, status: OrderStatus) => {
    let previous: Order[] = [];

    setOrders((prev) => {
      previous = prev;
      return prev.map((o) =>
        o.id === orderId ? { ...o, status } : o
      );
    });

    try {
      const res = await fetch("/api/orders/update", {
        method: "POST",
        body: JSON.stringify({ orderId, status }),
      });

      const data = await res.json();

      if (!data.success) throw new Error();
    } catch {
      setOrders(previous); // rollback
    }
  };

  return (
    <div>
      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #e5e7eb",
            padding: "16px",
            borderRadius: "10px",
            marginBottom: "14px",
            background: "#fff",
          }}
        >
          <strong>Order #{order.orderCode}</strong>
          <p>Status: {order.status}</p>

          <div>
            {order.items.map((item) => (
              <div key={item.id}>
                {item.quantity}x {item.name}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            {order.status === "PENDING" && (
              <>
                <button
                  onClick={() =>
                    updateStatus(order.id, "CONFIRMED")
                  }
                >
                  Accept
                </button>
                <button
                  onClick={() =>
                    updateStatus(order.id, "CANCELLED")
                  }
                >
                  Decline
                </button>
              </>
            )}

            {order.status === "COMPLETED" && (
              <button
                onClick={() =>
                  updateStatus(order.id, "COMPLETED")
                }
              >
                Mark Paid
              </button>
            )}
          </div>

          <p style={{ marginTop: 10, fontWeight: 600 }}>
            Total: ₹{order.total}
          </p>
        </div>
      ))}
    </div>
  );
}