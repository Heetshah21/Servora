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
      ordersToday,
      activeOrders,
      completedOrders,
      pendingOrders,
      readyOrders,
      revenueToday,
    ] = await Promise.all([
      // Orders today
      db.order.count({
        where: {
          tenantId,
          restaurantId,
          placedAt: {
            gte: startOfDay,
          },
        },
      }),

      // Active operational orders
      db.order.count({
        where: {
          tenantId,
          restaurantId,
          status: {
            in: [
              "PENDING",
              "CONFIRMED",
              "IN_PROGRESS",
              "READY",
            ],
          },
        },
      }),

      // Completed / paid today
      db.order.count({
        where: {
          tenantId,
          restaurantId,
          status: "PAID",
          placedAt: {
            gte: startOfDay,
          },
        },
      }),

      // Pending orders
      db.order.count({
        where: {
          tenantId,
          restaurantId,
          status: "PENDING",
        },
      }),

      // Ready orders
      db.order.count({
        where: {
          tenantId,
          restaurantId,
          status: "READY",
        },
      }),

      // Revenue today
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
    ]);

    const revenue =
      Number(
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
    });
  } catch (err) {
    console.log(err);

    return NextResponse.json({
      error: "Something went wrong",
    });
  }
}