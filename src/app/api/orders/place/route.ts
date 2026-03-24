import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  const body = await req.json();

  const { tenantSlug, items } = body;

  const tenant = await db.tenant.findFirst({
    where: { slug: tenantSlug },
    include: {
      restaurants: true,
    },
  });
  
  if (!tenant || tenant.restaurants.length === 0) {
    return NextResponse.json({ error: "Restaurant not found" });
  }
  
  const restaurant = tenant.restaurants[0];

  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found" });
  }

  let subtotal = 0;

  for (const item of items) {
    subtotal += item.price * item.quantity;
  }

  const tax = 0;
  const discount = 0;
  const total = subtotal + tax - discount;

  const order = await db.order.create({
    data: {
      tenantId: restaurant.tenantId,
      restaurantId: restaurant.id,
      status: "PENDING",
      subtotal: new Prisma.Decimal(subtotal),
      tax: new Prisma.Decimal(tax),
      discount: new Prisma.Decimal(discount),
      total: new Prisma.Decimal(total),
      currency: "INR",

      items: {
        create: items.map((item: any) => ({
          tenantId: restaurant.tenantId,
          menuItemId: item.id,
          name: item.name,
          unitPrice: new Prisma.Decimal(item.price),
          quantity: item.quantity,
          totalPrice: new Prisma.Decimal(
            item.price * item.quantity
          ),
        })),
      },
    },
  });

  return NextResponse.json({
    orderId: order.id,
  });
}