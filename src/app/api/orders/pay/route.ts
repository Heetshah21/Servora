import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { orderId, amount, tenantId } = body;

    if (!orderId || !amount || !tenantId) {
      return NextResponse.json({ success: false });
    }

    // Prevent duplicate payment
    const existingPayment = await db.payment.findFirst({
      where: {
        orderId,
        status: "CAPTURED",
      },
    });

    if (!existingPayment) {
      await db.payment.create({
        data: {
          orderId,
          tenantId,
          status: "CAPTURED",
          method: "CASH",
          amount: String(amount),
          currency: "INR",
          paidAt: new Date(),
        },
      });
    }

    // Mark order paid
    await db.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: OrderStatus.PAID,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PAY ERROR:", error);
    return NextResponse.json({ success: false });
  }
}