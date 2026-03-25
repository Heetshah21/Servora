import OrderStatusClient from "./OrderStatusClient";

interface Props {
  params: Promise<{
    tenant: string;
    orderId: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { orderId } = await params;

  return <OrderStatusClient orderId={orderId} />;
}