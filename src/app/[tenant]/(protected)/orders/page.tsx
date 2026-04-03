export const dynamic = "force-dynamic";
export const revalidate = 0;

import { requireAuth } from "@/lib/require-auth";
import { db } from "@/lib/db";
import { createTestOrder, updateOrderStatus, markOrderPaid } from "./actions";
import ActionButton from "@/components/ActionButton";

interface Props {
  params: Promise<{ tenant: string }>;
}

export default async function OrdersPage({ params }: Props) {
  const { tenant } = await params;

  const session = await requireAuth(tenant);

  const orders = await db.order.findMany({
    where: {
      tenantId: session.user.tenantId,
      restaurantId: session.user.restaurantId,
      payments: {
        none: {
          status: "CAPTURED",
        },
      },
      status: {
        not: "CANCELLED",
      },
    },
    include: {
      items: true,
      payments: true,
    },
    orderBy: {
      placedAt: "desc",
    },
  });

  return (
    <div>
      <h1 style={{ margin: "0 0 20px", fontSize: "28px", color: "#111827" }}>
        Orders
      </h1>

      {/* Create Test Order */}
      <ActionButton
        action={async () => {
          await createTestOrder(tenant);
        }}
        style={{
          padding: "10px 14px",
          background: "#111827",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: 500,
          marginBottom: "20px",
        }}
      >
        Create Test Order
      </ActionButton>

      {orders.length === 0 && <p>No orders yet.</p>}

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
          <strong style={{ color: "#111827" }}>
            Order #{order.orderCode}
          </strong>

          <p style={{ margin: "6px 0 0", color: "#4b5563", fontSize: "14px" }}>
            Status: {order.status}
          </p>

          {/* Items */}
          <div style={{ marginTop: "10px", display: "grid", gap: "4px" }}>
            {order.items.map((item) => (
              <div key={item.id} style={{ color: "#374151", fontSize: "14px" }}>
                {item.quantity}x {item.name}
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {order.status === "PENDING" && (
              <>
                <ActionButton
                  action={async () => {
                    const formData = new FormData();
                    formData.append("orderId", order.id);
                    formData.append("status", "CONFIRMED");
                    await updateOrderStatus(tenant, formData);
                  }}
                  style={{
                    padding: "8px 12px",
                    background: "#111827",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  Accept
                </ActionButton>

                <ActionButton
                  action={async () => {
                    const formData = new FormData();
                    formData.append("orderId", order.id);
                    formData.append("status", "CANCELLED");
                    await updateOrderStatus(tenant, formData);
                  }}
                  style={{
                    padding: "8px 12px",
                    background: "#fff",
                    color: "#111827",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  Decline
                </ActionButton>
              </>
            )}

            {order.status === "COMPLETED" && (
              <ActionButton
                action={async () => {
                  const formData = new FormData();
                  formData.append("orderId", order.id);
                  formData.append("amount", order.total.toString());
                  await markOrderPaid(tenant, formData);
                }}
                style={{
                  padding: "8px 12px",
                  background: "#16a34a",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Mark Paid
              </ActionButton>
            )}
          </div>

          <p style={{ marginTop: "10px", fontWeight: 600, color: "#111827" }}>
            Total: ₹{order.total.toString()}
          </p>
        </div>
      ))}
    </div>
  );
}