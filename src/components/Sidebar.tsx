"use client";

import { useState, useEffect } from "react";
import SidebarNavLink from "@/app/[tenant]/(protected)/SidebarNavLink";

export default function Sidebar({
  tenant,
  restaurantName,
}: {
  tenant: string;
  restaurantName: string;
}) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      {/* Mobile Topbar */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: "56px",
            background: "#f3f4f6",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            zIndex: 100,
          }}
        >
          <button
            onClick={() => setOpen(!open)}
            style={{
              marginRight: "12px",
              padding: "6px 10px",
              background: "#111827",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
            }}
          >
            ☰
          </button>

          <div style={{ fontWeight: 700 }}>{restaurantName}</div>
        </div>
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: "250px",
          background: "#ffffff",
          padding: "24px 16px",
          position: "fixed",
          top: isMobile ? "56px" : 0,
          left: isMobile ? (open ? 0 : "-260px") : 0,
          height: isMobile ? "calc(100vh - 56px)" : "100vh",
          overflowY: "auto",
          borderRight: "1px solid #e5e7eb",
          transition: "left 0.2s ease",
          zIndex: 99,
        }}
      >
        <h2 style={{ marginBottom: "24px" }}>{restaurantName}</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <SidebarNavLink href={`/${tenant}/dashboard`} label="Dashboard" onNavigate={() => setOpen(false)} />
          <SidebarNavLink href={`/${tenant}/menu`} label="Menu" onNavigate={() => setOpen(false)} />
          <SidebarNavLink href={`/${tenant}/orders`} label="Orders" onNavigate={() => setOpen(false)} />
          <SidebarNavLink href={`/${tenant}/orders/history`} label="Orders History" onNavigate={() => setOpen(false)} />
          <SidebarNavLink href={`/${tenant}/kitchen`} label="Kitchen" onNavigate={() => setOpen(false)} />
          <SidebarNavLink href={`/${tenant}/qr`} label="QR Codes" onNavigate={() => setOpen(false)} />
          <SidebarNavLink href={`/${tenant}/settings`} label="Settings" onNavigate={() => setOpen(false)} />
        </nav>
      </aside>
    </>
  );
}