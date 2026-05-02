"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function WeeklyChart({ data, type }: any) {
  const [height, setHeight] = useState(250);

  // ✅ Responsive height (safe for Next.js)
  useEffect(() => {
    if (window.innerWidth < 768) {
      setHeight(180);
    }
  }, []);

  const chartData = data.labels.map((label: string, index: number) => ({
    name: label,
    value: type === "orders" ? data.orders[index] : data.revenue[index],
  }));

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          {/* ✅ Smaller fonts for mobile */}
          <XAxis dataKey="name" fontSize={12} />
          <YAxis fontSize={12} />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#111827"
            strokeWidth={2}
            dot={{ r: 3 }} // small dots (better visibility)
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}