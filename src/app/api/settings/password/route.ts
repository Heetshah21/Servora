import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      userId,
      currentPassword,
      newPassword,
      confirmPassword,
    } = body;

    if (
      newPassword !==
      confirmPassword
    ) {
      return NextResponse.json({
        error:
          "Passwords do not match",
      });
    }

    const user =
      await db.user.findUnique({
        where: {
          id: userId,
        },
      });

    if (!user) {
      return NextResponse.json({
        error: "User not found",
      });
    }

    const valid =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!valid) {
      return NextResponse.json({
        error:
          "Current password incorrect",
      });
    }

    const hashed =
      await bcrypt.hash(
        newPassword,
        10
      );

    await db.user.update({
      where: {
        id: user.id,
      },

      data: {
        password: hashed,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    return NextResponse.json({
      error:
        "Something went wrong",
    });
  }
}