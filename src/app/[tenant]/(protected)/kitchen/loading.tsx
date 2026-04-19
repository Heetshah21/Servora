export default function Loading() {
    const box = {
      background: "#e5e7eb",
      borderRadius: "8px",
      height: "14px",
      marginBottom: "8px",
      animation: "pulse 1.5s infinite",
    };
  
    return (
      <div>
        <style>
          {`
            @keyframes pulse {
              0% { opacity: 0.6; }
              50% { opacity: 1; }
              100% { opacity: 0.6; }
            }
          `}
        </style>
  
        <h1 style={{ marginBottom: "20px" }}>Kitchen Board</h1>
  
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          {[1, 2].map((col) => (
            <div
              key={col}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                padding: "12px",
                background: "#fff",
              }}
            >
              <div style={{ ...box, width: "100px" }} />
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ ...box, width: "80%" }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }