import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export async function requireAuth(expectedTenantSlug: string) {
  const session = await auth();

  if (!session || !session.user) {
    redirect(`/${expectedTenantSlug}/login`);
  }

  // Get tenant from DB
  const tenant = await db.tenant.findUnique({
    where: { slug: expectedTenantSlug },
  });

  if (!tenant) {
    redirect("/");
  }

  // Check tenant match
  if (session.user.tenantId !== tenant.id) {
    redirect(`/${expectedTenantSlug}/login`);
  }

  // VERY IMPORTANT: ensure restaurantId exists
  if (!session.user.restaurantId) {
    throw new Error("User has no restaurantId");
  }

  return session;
}