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

    const interval = setInterval(loadOrder, 5000); // refresh every 5 sec

    return () => clearInterval(interval);
  }, []);

  if (!order) return <p style={{ padding: "20px", textAlign: "center" }}>Loading...</p>;

  const steps = ["PENDING", "CONFIRMED", "IN_PROGRESS", "READY", "COMPLETED"] as const;
  const currentStepIndex = Math.max(0, steps.indexOf(order.status));

  const statusTone =
    order.status === "COMPLETED"
      ? { bg: "#ecfdf3", border: "#bbf7d0", fg: "#166534" }
      : order.status === "READY"
        ? { bg: "#eff6ff", border: "#bfdbfe", fg: "#1d4ed8" }
        : order.status === "IN_PROGRESS"
          ? { bg: "#fff7ed", border: "#fed7aa", fg: "#9a3412" }
          : order.status === "CONFIRMED"
            ? { bg: "#eef2ff", border: "#c7d2fe", fg: "#3730a3" }
            : { bg: "#f3f4f6", border: "#e5e7eb", fg: "#374151" };

  const stepLabels: Record<string, string> = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    IN_PROGRESS: "Preparing",
    READY: "Ready",
    COMPLETED: "Done",
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
            WebkitBackdropFilter: "blur(10px)",
            boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
            padding: isMobile ? "14px" : "18px",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "12px", color: "#6b7280", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Order
              </div>
              <div style={{ fontSize: isMobile ? "22px" : "26px", fontWeight: 800, color: "#111827", marginTop: "4px" }}>
                #{order.orderCode || String(order.id || "").slice(0, 6)}
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
              {order.status}
            </span>
          </div>

          <div style={{ marginTop: "12px", display: "grid", gap: "6px" }}>
            {order.tableNumber ? (
              <div style={{ fontSize: "13px", color: "#6b7280" }}>
                Table {order.tableNumber}
              </div>
            ) : order.source === "DELIVERY" ? (
              <>
                <div style={{ fontSize: "13px", color: "#6b7280" }}>
                  Delivery – {order.customerName || ""}
                </div>
                <div style={{ fontSize: "13px", color: "#6b7280" }}>
                  Phone: {order.customerPhone || ""}
                </div>
                <div style={{ fontSize: "13px", color: "#6b7280" }}>
                  Address: {order.deliveryAddress || ""}
                </div>
              </>
            ) : order.source === "ONLINE" ? (
              <>
                <div style={{ fontSize: "13px", color: "#6b7280" }}>
                  Takeaway – {order.customerName || ""}
                </div>
                <div style={{ fontSize: "13px", color: "#6b7280" }}>
                  Phone: {order.customerPhone || ""}
                </div>
              </>
            ) : null}
          </div>

          {/* ORDER TRACKER */}
          <div style={{ marginTop: "16px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#111827", marginBottom: "10px" }}>
              Tracking
            </div>

            {isMobile ? (
              /* ── Vertical tracker for mobile ── */
              <div style={{ display: "flex", flexDirection: "column", gap: "0px", paddingLeft: "4px" }}>
                {steps.map((s, idx) => {
                  const isDone = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const dotBg = isCurrent || isDone ? "#111827" : "#e5e7eb";
                  const lineBg = isDone ? "#111827" : "#e5e7eb";

                  return (
                    <div key={s} style={{ display: "flex", alignItems: "stretch", gap: "12px" }}>
                      {/* Dot + vertical line */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "20px" }}>
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            borderRadius: "999px",
                            background: dotBg,
                            boxShadow: isCurrent ? "0 0 0 4px rgba(17,24,39,0.12)" : "none",
                            flex: "0 0 auto",
                            marginTop: "2px",
                          }}
                        />
                        {idx < steps.length - 1 && (
                          <div
                            style={{
                              width: "2px",
                              flex: 1,
                              minHeight: "20px",
                              background: lineBg,
                              margin: "4px 0",
                            }}
                          />
                        )}
                      </div>
                      {/* Label */}
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: isCurrent ? 800 : 600,
                          color: isCurrent ? "#111827" : "#6b7280",
                          paddingBottom: idx < steps.length - 1 ? "14px" : "0px",
                          paddingTop: "0px",
                          lineHeight: "1.2",
                        }}
                      >
                        {stepLabels[s] || s.replaceAll("_", " ")}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ── Horizontal tracker for desktop ── */
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                  gap: "10px",
                }}
              >
                {steps.map((s, idx) => {
                  const isDone = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const dotBg = isCurrent || isDone ? "#111827" : "#e5e7eb";
                  const lineBg = isDone ? "#111827" : "#e5e7eb";

                  return (
                    <div key={s} style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "999px",
                            background: dotBg,
                            boxShadow: isCurrent ? "0 0 0 4px rgba(17,24,39,0.12)" : "none",
                            flex: "0 0 auto",
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
                          textAlign: "left",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {stepLabels[s] || s.replaceAll("_", " ")}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: "14px", display: "grid", gap: "14px" }}>
          <div
            style={{
              borderRadius: "16px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
              padding: isMobile ? "14px" : "16px",
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: 800, color: "#111827", marginBottom: "10px" }}>
              Items
            </div>

            <div style={{ display: "grid", gap: "10px" }}>
              {order.items.map((item: any) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "12px",
                    padding: isMobile ? "10px" : "12px",
                    borderRadius: "12px",
                    border: "1px solid #eef2f7",
                    background: "#ffffff",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <div style={{ fontWeight: 700, color: "#111827", fontSize: isMobile ? "14px" : "inherit" }}>{item.name}</div>
                      {item.isJain && (
                        <span
                          style={{
                            display: "inline-flex",
                            padding: "3px 8px",
                            borderRadius: "999px",
                            fontSize: "12px",
                            background: "#ecfdf3",
                            border: "1px solid #bbf7d0",
                            color: "#166534",
                            fontWeight: 700,
                          }}
                        >
                          Jain
                        </span>
                      )}
                    </div>
                    {item.notes && (
                      <div style={{ marginTop: "6px", fontSize: "12px", color: "#6b7280" }}>
                        Note: {item.notes}
                      </div>
                    )}
                  </div>

                  <div style={{ color: "#111827", fontWeight: 800, whiteSpace: "nowrap" }}>
                    × {item.quantity}
                  </div>
                </div>
              ))}
            </div>

            {order.notes && (
              <div
                style={{
                  marginTop: "12px",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  background: "#f9fafb",
                  padding: "12px",
                }}
              >
                <div style={{ fontSize: "12px", fontWeight: 800, color: "#111827", marginBottom: "4px" }}>
                  Special instructions
                </div>
                <div style={{ fontSize: "13px", color: "#374151" }}>{order.notes}</div>
              </div>
            )}
          </div>

          <div
            style={{
              borderRadius: "16px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
              padding: isMobile ? "14px" : "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <div style={{ color: "#6b7280", fontWeight: 700 }}>Total</div>
            <div style={{ fontSize: isMobile ? "18px" : "20px", fontWeight: 900, color: "#111827" }}>₹{order.total}</div>
          </div>
        </div>
      </div>
    </div>
  );
}