import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

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

    const restaurant =
      await db.restaurant.findFirst({
        where: {
          tenantId,
          id: restaurantId,
        },
      });

    return NextResponse.json(
      restaurant
    );
  } catch (err) {
    return NextResponse.json({
      error: "Something went wrong",
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      restaurantId,
      name,
      currency,
      taxPercent,
      servicePercent,
      phone,
      upiId,
      acceptsDineIn,
      acceptsTakeaway,
      acceptsDelivery,
    } = body;

    await db.restaurant.update({
      where: {
        id: restaurantId,
      },

      data: {
        name,
        currency,
        phone,
        upiId,

        acceptsDineIn,
        acceptsTakeaway,
        acceptsDelivery,

        taxPercent:
          new Prisma.Decimal(
            taxPercent
          ),

        servicePercent:
          new Prisma.Decimal(
            servicePercent
          ),
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.log(err);

    return NextResponse.json({
      error: "Failed to update",
    });
  }
}