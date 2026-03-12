import { requireAuth } from "@/lib/require-auth";
import { db } from "@/lib/db";

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
      <h1 style={{ marginBottom: "30px" }}>Orders</h1>

      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <strong>Order #{order.orderCode || order.id.slice(0, 6)}</strong>

          {order.tableNumber && (
            <p>Table: {order.tableNumber}</p>
          )}

          <p>Status: {order.status}</p>

          <div style={{ marginTop: "10px" }}>
            {order.items.map((item) => (
              <div key={item.id}>
                {item.quantity}x {item.name}
              </div>
            ))}
          </div>

          <p style={{ marginTop: "10px" }}>
            Total: ₹{order.total.toString()}
          </p>
        </div>
      ))}
    </div>
  );
}