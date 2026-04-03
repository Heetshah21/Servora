export const dynamic = "force-dynamic";
export const revalidate = 0;

import { requireAuth } from "@/lib/require-auth";
import { db } from "@/lib/db";
import { updateKitchenOrderStatus } from "./actions";
import ActionButton from "@/components/ActionButton";

interface Props {
  params: Promise<{ tenant: string }>;
}

export default async function KitchenPage({ params }: Props) {
  const { tenant } = await params;
  const session = await requireAuth(tenant);

  const orders = await db.order.findMany({
    where: {
      tenantId: session.user.tenantId,
      restaurantId: session.user.restaurantId,
      status: {
        in: ["PENDING", "CONFIRMED"],
      },
    },
    include: {
      items: true,
    },
    orderBy: {
      placedAt: "asc",
    },
  });

  const pending = orders.filter((o) => o.status === "PENDING");
  const confirmed = orders.filter((o) => o.status === "CONFIRMED");

  return (
    <div>
      <h1 style={{ margin: "0 0 20px", fontSize: "28px", color: "#111827" }}>
        Kitchen Board
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "14px",
        }}
      >
        <Column title="Pending" orders={pending} tenant={tenant} />
        <Column title="Confirmed" orders={confirmed} tenant={tenant} />
      </div>
    </div>
  );
}

function Column({ title, orders, tenant }: any) {
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

      {orders.map((order: any) => (
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
            {order.items.map((item: any) => (
              <div key={item.id}>
                {item.quantity}x {item.name}
              </div>
            ))}
          </div>

          <div style={{ marginTop: "10px", display: "flex", gap: "6px" }}>
            {order.status === "PENDING" && (
              <>
                <ActionButton
                  action={updateKitchenOrderStatus}
                  tenant={tenant}
                  orderId={order.id}
                  status="CONFIRMED"
                  style={{
                    padding: "8px 12px",
                    background: "#111827",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                >
                  Accept
                </ActionButton>

                <ActionButton
                  action={updateKitchenOrderStatus}
                  tenant={tenant}
                  orderId={order.id}
                  status="CANCELLED"
                  style={{
                    padding: "8px 12px",
                    background: "#fff",
                    color: "#111827",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                >
                  Decline
                </ActionButton>
              </>
            )}

            {order.status === "CONFIRMED" && (
              <ActionButton
                action={updateKitchenOrderStatus}
                tenant={tenant}
                orderId={order.id}
                status="COMPLETED"
                style={{
                  padding: "8px 12px",
                  background: "#16a34a",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
              >
                Ready
              </ActionButton>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}