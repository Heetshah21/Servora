import { requireAuth } from "@/lib/require-auth";
import { db } from "@/lib/db";
import { createCategory, createMenuItem, deleteMenuItem } from "./actions";
import MenuItemCard from "./MenuItemCard";

interface Props {
  params: Promise<{ tenant: string }>;
}

export default async function MenuPage({ params }: Props) {
  const { tenant } = await params;

  const session = await requireAuth(tenant);

  const categories = await db.menuCategory.findMany({
    where: {
      tenantId: session.user.tenantId,
    },
    include: {
      menuItems: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <div>
      <h1 style={{ marginBottom: "30px" }}>Menu Management</h1>
      <form 
      action={async (formData: FormData) => {
        "use server";
        await createCategory(tenant, formData);
      }}
    style={{ marginBottom: "30px" }}
    >
    <input type="text"
    name="name"
    placeholder="New Category Name"
    style={{
      padding: "8px",
      marginRight: "10px",
      borderRadius: "6px",
      border: "1px solid #ccc",
    }}
  />
  <button
    type="submit"
    style={{
      padding: "8px 14px",
      borderRadius: "6px",
      border: "none",
      background: "black",
      color: "white",
      cursor: "pointer",
    }}
  >
    Add Category
  </button>
</form>
    
      {categories.length === 0 && <p>No categories found.</p>}

      {categories.map((category) => (
        <div key={category.id} style={{ marginBottom: "40px" }}>
          <h2>{category.name}</h2>
          <form
            action={async (formData: FormData) => {
              "use server";
              await createMenuItem(tenant, formData);
            }}
            style={{ marginTop: "10px", marginBottom: "15px" }}
          >
            <input type="hidden" name="categoryId" value={category.id} />

            <input
              name="name"
              placeholder="Item name"
              required
              style={{
                padding: "6px",
                marginRight: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />

            <input
              name="price"
              type="number"
              step="0.01"
              placeholder="Price"
              required
              style={{
                padding: "6px",
                marginRight: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                width: "100px",
              }}
            />

            <input
              name="description"
              placeholder="Description"
              style={{
                padding: "6px",
                marginRight: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
                 <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginRight: "15px",
                  }}
                >
                  <input type="checkbox" name="isJainAvailable" />
                  Jain
                </label>
            <button
              type="submit"
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                background: "#333",
                color: "white",
                cursor: "pointer",
                marginLeft: "5px",
              }}
            >
              
              Add Item
            </button>
          </form>
          {category.menuItems.length === 0 && (
            <p style={{ color: "gray" }}>No items in this category.</p>
          )}

            {category.menuItems.map((item) => (
              <MenuItemCard
                key={item.id}
                tenant={tenant}
                item={{
                  ...item,
                  price: item.price.toString(),
                }}
              />
            ))}
          </div>
        ))}
      </div>

  );
}
