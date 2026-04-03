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
      status: {
        not: "CANCELLED",
      },
    },
    include: {
      items: true,
    },
    orderBy: {
      placedAt: "desc",
    },
  });

  return (
    <div>
      <h1 style={{ margin: "0 0 20px", fontSize: "28px" }}>Orders</h1>

      <ActionButton
        action={createTestOrder}
        tenant={tenant}
        style={{
          padding: "10px 14px",
          background: "#111827",
          color: "white",
          border: "none",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        Create Test Order
      </ActionButton>

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

          <div style={{ marginTop: "10px" }}>
            {order.items.map((item) => (
              <div key={item.id}>
                {item.quantity}x {item.name}
              </div>
            ))}
          </div>

          <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
            {order.status === "PENDING" && (
              <>
                <ActionButton
                  action={updateOrderStatus}
                  tenant={tenant}
                  orderId={order.id}
                  status="CONFIRMED"
                  style={{
                    padding: "8px 12px",
                    background: "#111827",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                  }}
                >
                  Accept
                </ActionButton>

                <ActionButton
                  action={updateOrderStatus}
                  tenant={tenant}
                  orderId={order.id}
                  status="CANCELLED"
                  style={{
                    padding: "8px 12px",
                    background: "#fff",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                  }}
                >
                  Decline
                </ActionButton>
              </>
            )}

            {order.status === "COMPLETED" && (
              <ActionButton
                action={markOrderPaid}
                tenant={tenant}
                orderId={order.id}
                amount={String(order.total)}
                style={{
                  padding: "8px 12px",
                  background: "#16a34a",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                }}
              >
                Mark Paid
              </ActionButton>
            )}
          </div>

          <p style={{ marginTop: "10px", fontWeight: 600 }}>
            Total: ₹{Number(order.total)}
          </p>
        </div>
      ))}
    </div>
  );
}