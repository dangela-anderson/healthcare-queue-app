"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

interface PeakHourChartProps {
  data: Record<number, number>;
}

const chartConfig = {
  visits: {
    label: "Patients",
  },
} satisfies ChartConfig;

export function PeakHourChart({ data }: PeakHourChartProps) {
  // 1. Transform Record<number, number> into Recharts array format
  const chartData = Object.entries(data).map(([hourStr, count]) => {
    const hour = Number(hourStr);
    return {
      hour,
      label: `${hour.toString().padStart(2, "0")}:00`,
      visits: count,
    };
  });

  return (
    <ChartContainer
      config={chartConfig}
      className="max-h-[500px] w-full mt-4 mx-2"
    >
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />

        {/* X-Axis */}
        <XAxis
          dataKey="label"
          tickLine={false}
          tickMargin={10}
          axisLine={true}
          label={{
            value: "Hour of Day",
            position: "insideBottom",
            offset: -10,
            className: "fill-slate-500 text-xs",
          }}
        />

        {/* Y-Axis */}
        <YAxis
          tickLine={false}
          axisLine={true}
          label={{
            value: "# of Patients",
            angle: -90,
            position: "insideLeft",
            offset: 0,
            className: "fill-slate-500 text-xs",
          }}
        />

        {/* Bars */}
        <Bar
          fill="#015583"
          maxBarSize={32}
          dataKey="visits"
          radius={[1, 1, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
