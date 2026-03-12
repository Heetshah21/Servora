"use client";

import { useState } from "react";
import { updateMenuItem, toggleItemAvailability } from "./actions";

interface Props {
    tenant: string;
    item: {
      id: string;
      name: string;
      price: string;
      description: string | null;
      isJainAvailable: boolean;
    };
  }

export default function MenuItemCard({ item, tenant }: Props) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <form
        action={async (formData: FormData) => {
          await updateMenuItem(tenant, formData);
          setEditing(false);
        }}
        style={{
          border: "1px solid #ddd",
          padding: "10px",
          marginTop: "10px",
          borderRadius: "8px",
          
        }}
      >
        <input type="hidden" name="itemId" value={item.id} />
  
        <input name="name" defaultValue={item.name} />
  
        <input
          name="price"
          type="number"
          step="0.01"
          defaultValue={item.price}
        />
  
        <input
          name="description"
          defaultValue={item.description || ""}
        />
  
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "6px",
          }}
        >
          <input
            type="checkbox"
            name="isJainAvailable"
            defaultChecked={item.isJainAvailable}
          />
          Jain
        </label>
  
        <div style={{ marginTop: "8px" }}>
          <button
            type="button"
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
  
          <button
            type="submit"
            style={{
              marginLeft: "10px",
              background: "green",
              color: "white",
              border: "none",
              padding: "4px 10px",
              borderRadius: "5px",
            }}
          >
            Save
          </button>
        </div>
      </form>
    );
  }

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "10px",
        marginTop: "10px",
        borderRadius: "8px",
        opacity: item.isAvailable ? 1 : 0.5,
        background: item.isAvailable ? "white" : "#f5f5f5",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <strong>{item.name}</strong> – ₹{item.price.toString()}

          {item.isJainAvailable && (
            <span
              style={{
                padding: "3px 8px",
                background: "green",
                color: "white",
                borderRadius: "6px",
                fontSize: "12px",
              }}
            >
              Jain Available
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setEditing(true)}
            style={{
              padding: "4px 10px",
              background: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Edit
          </button>
        </div>
      </div>

      <p style={{ marginTop: "5px", color: "#555" }}>
        {item.description}
      </p>
      <form
        action={async (formData: FormData) => {
            await toggleItemAvailability(tenant, formData);
        }}
        style={{ marginTop: "6px" }}
        >
        <input type="hidden" name="itemId" value={item.id} />

        <label
            style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            }}
        >
            <input
            type="checkbox"
            name="isAvailable"
            defaultChecked={item.isAvailable}
            onChange={(e) => e.currentTarget.form?.requestSubmit()}
            />
            Available
        </label>
        </form>
    </div>
  );
}