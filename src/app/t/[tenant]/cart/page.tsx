import CartClient from "./CartClient";

interface Props {
  params: Promise<{ tenant: string }>;
}

export default async function CartPage({ params }: Props) {
  const { tenant } = await params;

  return <CartClient tenant={tenant} />;
}