import { db } from "@/lib/db";
import QRClient from "./QRClient";

interface Props {
  params: Promise<{ tenant: string }>;
}

export default async function QRPage({ params }: Props) {
  const { tenant } = await params;

  const restaurant = await db.restaurant.findFirst({
    where: {
      tenant: {
        slug: tenant,
      },
    },
  });

  if (!restaurant || !restaurant.shortCode) {
    return <div>Restaurant short code not set</div>;
  }

  return (
    <div>
      <QRClient shortCode={restaurant.shortCode} />
    </div>
  );
}