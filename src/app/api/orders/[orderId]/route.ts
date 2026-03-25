import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await context.params;

  const order = await db.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" });
  }

  return NextResponse.json(order);
}