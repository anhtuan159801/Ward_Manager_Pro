'use client';

import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import type { Resident } from "@/lib/types";

type Props = {
  residents: Resident[];
};

const chartConfig = {
  residents: {
    label: "Cư dân mới",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

function buildMonthlyData(residents: Resident[]) {
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const counts = new Array(12).fill(0);
  for (const r of residents) {
    // r.joinedDate is DD/MM/YYYY
    const parts = r.joinedDate?.split('/') || [];
    if (parts.length === 3) {
      const monthIdx = parseInt(parts[1], 10) - 1;
      if (!Number.isNaN(monthIdx) && monthIdx >= 0 && monthIdx < 12) {
        counts[monthIdx] += 1;
      }
    }
  }
  return counts.map((count, i) => ({ month: monthNames[i], residents: count }));
}

export function ResidentGrowthChart({ residents }: Props) {
  const data = buildMonthlyData(residents);
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar dataKey="residents" fill="var(--color-residents)" radius={8} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
