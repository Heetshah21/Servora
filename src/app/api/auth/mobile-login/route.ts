import { db } from "@/lib/db";

import bcrypt from "bcrypt";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, password, tenantSlug } = body;

    if (!email || !password || !tenantSlug) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const tenant = await db.tenant.findUnique({
      where: {
        slug: tenantSlug,
      },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: "Invalid restaurant code" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: {
        email_tenantId: {
          email,
          tenantId: tenant.id,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(
      password,
      user.password
    );

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      id: user.id,
      role: user.role,
      tenantId: user.tenantId,
      restaurantId: user.restaurantId,
      email: user.email,
    });
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}