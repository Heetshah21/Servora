import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params;

    const order = await db.order.findUnique({
      where: {
        id: orderId,
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
            notes: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...order,
      total: Number(order.total),
    });
  } catch (error) {
    console.error("ORDER API ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}