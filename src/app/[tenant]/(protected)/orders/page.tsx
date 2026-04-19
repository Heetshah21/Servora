export const dynamic = "force-dynamic";
export const revalidate = 0;

import { requireAuth } from "@/lib/require-auth";
import { db } from "@/lib/db";
import OrdersClient from "@/components/OrdersClient";

interface Props {
  params: Promise<{ tenant: string }>;
}

export default async function OrdersPage({ params }: Props) {
  const { tenant } = await params;
  const session = await requireAuth(tenant);

  const rawOrders = await db.order.findMany({
    where: {
      tenantId: session.user.tenantId,
      restaurantId: session.user.restaurantId,
      status: {
        not: "CANCELLED",
      },
    },
    select: {
      id: true,
      orderCode: true,
      status: true,
      total: true,
      items: {
        select: {
          id: true,
          name: true,
          quantity: true,
        },
      },
    },
    orderBy: {
      placedAt: "desc",
    },
  });
  const orders = rawOrders.map((o) => ({
    id: o.id,
    orderCode: o.orderCode ?? "-",
    status: o.status,
    total: Number(o.total),
    items: o.items,
  }));
  return (
    <div>
      <h1>Orders</h1>
  
      <OrdersClient
        initialOrders={orders}
        tenantId={session.user.tenantId}
        restaurantId={session.user.restaurantId}
      />
    </div>
  );
}