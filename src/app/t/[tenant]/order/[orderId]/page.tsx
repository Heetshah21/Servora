import { db } from "@/lib/db";

interface Props {
  params: Promise<{
    tenant: string;
    orderId: string;
  }>;
}

export default async function OrderStatusPage({ params }: Props) {
  const { orderId } = await params;

  const order = await db.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Order Status</h1>

      <p>Status: {order.status}</p>

      <h3>Items</h3>

      {order.items.map((item) => (
        <div key={item.id}>
          {item.name} x {item.quantity}
        </div>
      ))}

      <h2>Total: ₹{order.total.toString()}</h2>
    </div>
  );
}