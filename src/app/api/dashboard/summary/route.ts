import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const tenantId =
      searchParams.get("tenantId");

    const restaurantId =
      searchParams.get("restaurantId");

    if (!tenantId || !restaurantId) {
      return NextResponse.json({
        error: "Missing params",
      });
    }

    const startOfDay = new Date();

    startOfDay.setHours(0, 0, 0, 0);

    const [
      orders,
      revenueToday,
      menuItems,
    ] = await Promise.all([
      // Single optimized orders query
      db.order.findMany({
        where: {
          tenantId,
          restaurantId,
          placedAt: {
            gte: startOfDay,
          },
        },

        select: {
          status: true,
          source: true,
        },
      }),

      // Revenue aggregate
      db.payment.aggregate({
        where: {
          tenantId,
          order: {
            restaurantId,
          },
          status: "CAPTURED",
          paidAt: {
            gte: startOfDay,
          },
        },

        _sum: {
          amount: true,
        },
      }),

      // Menu count
      db.menuItem.count({
        where: {
          tenantId,
          restaurantId,
        },
      }),
    ]);

    // In-memory analytics calculations
    const ordersToday = orders.length;

    const completedOrders =
      orders.filter(
        (o) => o.status === "PAID"
      ).length;

    const pendingOrders = orders.filter(
      (o) => o.status === "PENDING"
    ).length;

    const readyOrders = orders.filter(
      (o) => o.status === "READY"
    ).length;

    const activeOrders = orders.filter((o) =>
      [
        "PENDING",
        "CONFIRMED",
        "IN_PROGRESS",
        "READY",
      ].includes(o.status)
    ).length;

    const dineInOrders = orders.filter(
      (o) => o.source === "IN_STORE"
    ).length;

    const takeawayOrders = orders.filter(
      (o) => o.source === "TAKEAWAY"
    ).length;

    const deliveryOrders = orders.filter(
      (o) => o.source === "DELIVERY"
    ).length;

    const revenue = Number(
      revenueToday._sum.amount ?? 0
    );

    const avgOrderValue =
      completedOrders > 0
        ? Math.round(
            revenue / completedOrders
          )
        : 0;

    return NextResponse.json({
      ordersToday,
      activeOrders,
      completedOrders,
      pendingOrders,
      readyOrders,

      revenueToday: revenue,
      avgOrderValue,

      menuItems,

      dineInOrders,
      takeawayOrders,
      deliveryOrders,
    });
  } catch (err) {
    console.log(err);

    return NextResponse.json({
      error: "Something went wrong",
    });
  }
}