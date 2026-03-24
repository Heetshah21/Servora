  import { db } from "@/lib/db";
  import AddToCartButton from "@/components/AddToCartButton";
  import CartBar from "@/components/CartBar";

  interface Props {
    params: Promise<{ tenant: string }>;
  }

  export default async function CustomerMenuPage({ params }: Props) {
    const { tenant } = await params;

    const restaurant = await db.restaurant.findFirst({
      where: {
        slug: tenant,
      },
    });

    const categories = await db.menuCategory.findMany({
      where: {
        tenantId: restaurant?.tenantId,
        restaurantId: restaurant?.id,
        isActive: true,
      },
      include: {
        menuItems: {
          where: {
            isAvailable: true,
          },
        },
      },
      orderBy: {
        position: "asc",
      },
    });

    return (
      <>
      <div style={{ padding: "15px", maxWidth: "600px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "5px" }}>
          {restaurant?.name}
        </h1>

        <p style={{ marginBottom: "20px", color: "#666" }}>
          Menu
        </p>

        {categories.map((category) => (
          <div key={category.id} style={{ marginBottom: "25px" }}>
            <h2 style={{ marginBottom: "10px" }}>
              {category.name}
            </h2>

            {category.menuItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: "10px",
                  padding: "10px",
                  border: "1px solid #eee",
                  borderRadius: "8px",
                  marginBottom: "10px",
                  background: "white",
                }}
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />
                )}

                <div style={{ flex: 1 }}>
                  <strong>{item.name}</strong>
                  <p style={{ margin: "3px 0", color: "#666" }}>
                    {item.description}
                  </p>
                  <p>₹{item.price.toString()}</p>
                </div>

                <AddToCartButton
                item={{
                  id: item.id,
                  name: item.name,
                  price: Number(item.price),
                  imageUrl: item.imageUrl,
                }}
              />
              </div>
            ))}
          </div>
        ))}
      </div>
      <CartBar tenant={tenant} />
      </>
    );
  }