'use client';

import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { CardContent } from "./ui/card";


const chartData = [
  { month: "Jan", residents: 186 },
  { month: "Feb", residents: 305 },
  { month: "Mar", residents: 237 },
  { month: "Apr", residents: 273 },
  { month: "May", residents: 209 },
  { month: "Jun", residents: 214 },
];

const chartConfig = {
  residents: {
    label: "Cư dân",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function ResidentGrowthChart() {
    return (
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="residents" fill="var(--color-residents)" radius={8} />
              </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    )
}
