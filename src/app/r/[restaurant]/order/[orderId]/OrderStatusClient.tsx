"use client";

import { useEffect, useState } from "react";
import { useIsMobile } from "@/lib/useIsMobile";

export default function OrderStatusClient({ orderId }: any) {
  const [order, setOrder] = useState<any>(null);
  const isMobile = useIsMobile();

  const loadOrder = async () => {
    const res = await fetch(`/api/orders/${orderId}`);
    const data = await res.json();
    setOrder(data);
  };

  useEffect(() => {
    loadOrder();
    const interval = setInterval(loadOrder, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!order)
    return (
      <p style={{ padding: "20px", textAlign: "center" }}>Loading...</p>
    );

  // Determine PAID / DONE display status
  const isPaid = order.payments && order.payments.length > 0;

  const displayStatus = isPaid
    ? "PAID"
    : order.status === "COMPLETED"
    ? "DONE"
    : order.status;

  const steps = ["PENDING", "CONFIRMED", "DONE", "PAID"];
  const currentStepIndex = Math.max(0, steps.indexOf(displayStatus));

  const statusTone =
    displayStatus === "PAID"
      ? { bg: "#ecfdf3", border: "#bbf7d0", fg: "#166534" }
      : displayStatus === "DONE"
      ? { bg: "#eff6ff", border: "#bfdbfe", fg: "#1d4ed8" }
      : displayStatus === "CONFIRMED"
      ? { bg: "#fff7ed", border: "#fed7aa", fg: "#9a3412" }
      : { bg: "#f3f4f6", border: "#e5e7eb", fg: "#374151" };

  const stepLabels: Record<string, string> = {
    PENDING: "Order Placed",
    CONFIRMED: "Confirmed",
    DONE: "Done",
    PAID: "Paid",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f6f8",
        padding: isMobile ? "16px 10px" : "28px 16px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: "760px", margin: "0 auto", width: "100%" }}>
        <div
          style={{
            borderRadius: "16px",
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(229,231,235,0.9)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
            padding: isMobile ? "14px" : "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Order
              </div>
              <div
                style={{
                  fontSize: isMobile ? "22px" : "26px",
                  fontWeight: 800,
                  color: "#111827",
                  marginTop: "4px",
                }}
              >
                #{order.orderCode}
              </div>
            </div>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "8px 12px",
                borderRadius: "999px",
                border: `1px solid ${statusTone.border}`,
                background: statusTone.bg,
                color: statusTone.fg,
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              {displayStatus}
            </span>
          </div>

          {/* Tracker */}
          <div style={{ marginTop: "16px" }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                marginBottom: "10px",
              }}
            >
              Tracking
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
                gap: "10px",
              }}
            >
              {steps.map((s, idx) => {
                const isDone = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const dotBg = isCurrent || isDone ? "#111827" : "#e5e7eb";
                const lineBg = isDone ? "#111827" : "#e5e7eb";

                return (
                  <div key={s}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "999px",
                          background: dotBg,
                          boxShadow: isCurrent
                            ? "0 0 0 4px rgba(17,24,39,0.12)"
                            : "none",
                        }}
                      />
                      {idx < steps.length - 1 && (
                        <div
                          style={{
                            height: "2px",
                            background: lineBg,
                            flex: 1,
                            marginLeft: "8px",
                            marginRight: "8px",
                          }}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        marginTop: "8px",
                        fontSize: "11px",
                        fontWeight: isCurrent ? 800 : 700,
                        color: isCurrent ? "#111827" : "#6b7280",
                      }}
                    >
                      {stepLabels[s]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Items */}
        <div style={{ marginTop: "14px" }}>
          <div
            style={{
              borderRadius: "16px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              padding: isMobile ? "14px" : "16px",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: 800,
                marginBottom: "10px",
              }}
            >
              Items
            </div>

            <div style={{ display: "grid", gap: "10px" }}>
              {order.items.map((item: any) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {item.name}
                    {item.notes && (
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        Note: {item.notes}
                      </div>
                    )}
                  </div>
                  <div>× {item.quantity}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div
            style={{
              marginTop: "12px",
              borderRadius: "16px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              padding: isMobile ? "14px" : "16px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>Total</div>
            <div style={{ fontWeight: 900 }}>₹{order.total}</div>
          </div>
        </div>
      </div>
    </div>
  );
}