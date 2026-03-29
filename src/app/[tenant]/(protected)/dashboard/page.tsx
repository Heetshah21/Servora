export const dynamic = "force-dynamic";
export const revalidate = 0;

import { requireAuth } from "@/lib/require-auth";
import { db } from "@/lib/db";

interface Props {
  params: Promise<{ tenant: string }>;
}

export default async function DashboardPage({ params }: Props) {
  const { tenant } = await params;

  console.log("STEP 1 - Tenant param:", tenant);

  const session = await requireAuth(tenant);
  console.log("STEP 2 - Session:", session);
  console.log("STEP 2 - Session user:", session?.user);

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  try {
    const restaurant = await db.restaurant.findFirst({
      where: {
        id: session.user.restaurantId,
      },
    });
    console.log("STEP 3 - Restaurant:", restaurant);

    const ordersToday = await db.order.count({
      where: {
        tenantId: session.user.tenantId,
        restaurantId: session.user.restaurantId,
        placedAt: {
          gte: startOfDay,
        },
      },
    });
    console.log("STEP 4 - Orders Today:", ordersToday);

    const activeOrders = await db.order.count({
      where: {
        tenantId: session.user.tenantId,
        restaurantId: session.user.restaurantId,
        status: {
          in: ["PENDING", "CONFIRMED", "IN_PROGRESS", "READY"],
        },
      },
    });
    console.log("STEP 5 - Active Orders:", activeOrders);

    const menuItems = await db.menuItem.count({
      where: {
        tenantId: session.user.tenantId,
        restaurantId: session.user.restaurantId,
      },
    });
    console.log("STEP 6 - Menu Items:", menuItems);

    const revenueToday = await db.payment.aggregate({
      where: {
        tenantId: session.user.tenantId,
        order: {
          restaurantId: session.user.restaurantId,
        },
        status: "CAPTURED",
        paidAt: {
          gte: startOfDay,
        },
      },
      _sum: {
        amount: true,
      },
    });
    console.log("STEP 7 - Revenue Aggregate:", revenueToday);

    const revenue = revenueToday?._sum?.amount?.toString() ?? "0";

    const completedOrdersToday = await db.order.count({
      where: {
        tenantId: session.user.tenantId,
        restaurantId: session.user.restaurantId,
        status: "COMPLETED",
        placedAt: {
          gte: startOfDay,
        },
      },
    });
    console.log("STEP 8 - Completed Orders:", completedOrdersToday);

    return (
      <div>
        <h1>Dashboard Loaded Successfully</h1>
      </div>
    );

  } catch (err) {
    console.log("DASHBOARD ERROR:", err);
    return <div>Dashboard Error - Check Logs</div>;
  }
}