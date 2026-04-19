import { requireAuth } from "@/lib/require-auth";
import { db } from "@/lib/db";
import Sidebar from "@/components/Sidebar";
import { cache } from "react";

interface Props {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}

export default async function TenantLayout({
  children,
  params,
}: Props) {
  const { tenant } = await params;

  const session = await requireAuth(tenant);

  const getRestaurant = cache(async (tenantId: string) => { 
    return db.restaurant.findFirst({
      where: {
        tenantId,
      },
    });
  });

  const restaurant = await getRestaurant(session.user.tenantId);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f3f4f6",
      }}
    >
      <Sidebar
        tenant={tenant}
        restaurantName={restaurant?.name || "Servora"}
      />

      <main
        style={{
          flex: 1,
          padding: "28px",
          minHeight: "100vh",
          background: "#f3f4f6",
          marginLeft: "250px",
        }}
        className="servora-main"
      >
        {children}
      </main>

      {/* Mobile override */}
      <style>
        {`
          @media (max-width: 768px) {
            .servora-main {
              margin-left: 0 !important;
              padding-top: 70px !important;
            }
          }
        `}
      </style>
    </div>
  );
}